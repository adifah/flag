/**
 * Module dependencies.
 */

var express = require('express')
  , everyauth = require('everyauth')
  , auth = require('./auth')
  , conf = require('./conf')
  , routes = require('./routes')
  , logger = require('winston')
  , connect = require('express/node_modules/connect')
  , sessionStore = new connect.session.MemoryStore
  , users = require('./users')
  , games = require('./games')
  , loggly = require('winston-loggly');  // Requiring `winston-loggly` will expose `winston.transports.Loggly`

logger.add(logger.transports.File, conf.logger.file);
logger.add(logger.transports.Loggly, conf.logger.loggly);

var port = process.env.C9_PORT || process.env.PORT || 3000; // process.env.C9_PORT is for c9.io, process.env.PORT is for heroku, 3000 for everything else

everyauth.debug = false;

// start server
var app = module.exports = express.createServer();

// connect socket.io to express
var io = require('socket.io').listen(app);

// set socket protocol to xhr-polling (no websocket support from c9.io or heroku yet
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

// Configuration
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.cookieParser()); // allows dealing with cookies
    app.use(express.session({secret: 'fsln12team3', store: sessionStore})); //passphrase to hash the session
    app.use(everyauth.middleware()); // allows express helpers determining the login status or accessing user details
    everyauth.helpExpress(app); // allows using helper methods in express views (like everyauth.loggedIn)
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Sockets
io.sockets.on('connection', function (socket) {
    var twitterId = socket.handshake.session.auth.twitter.user.id;
    socket.on('start', function (data) {
        logger.info("user " + twitterId + " starts game " + data.game);
        // create a new game instance with given data.level assigend to twitterId
        // a given callback should emit the game details to the client
        if(data.game === 'memorize') {
            games.createMemoryGame(data, function(game) {
                socket.emit('newGame', game);
            });
        }
        if(data.game === 'gpsQuestioning') {
            games.createGpsQuestioningGame(data, function(game) {
                socket.emit('newGame', game);
            });
        }
    });
    socket.on('score', function (data) {
        var user = users.getUser(twitterId);
        logger.info("user " + twitterId + " finished with " + data.score + " points");
        users.setScore(twitterId, data);
    });
});
// set authorization for socket.io, only users with a cookie containing an express sid are accepted
io.set('authorization', function (data, accept) {
    if (data.headers.cookie) {
        logger.info("cookie: " + data.headers.cookie);
        
        data.cookie = connect.utils.parseCookie(data.headers.cookie);
        data.sessionID = data.cookie['connect.sid'];
        // (literally) get the session data from the session store
        sessionStore.get(data.sessionID, function (err, session) {
            if (err || !session) {
                // if we cannot grab a session, turn down the connection
                logger.info("no session");
                accept('Error', false);
            } else {
                if(!session.auth) {
                    logger.info("user not logged in");
                    accept('Error', false);
                } else {
                    // save the session data and accept the connection
                    logger.info("accept: ");
                    data.session = session;
                    accept(null, true);
                }
            }
        });
    } else {
        logger.info("no cookie");
       return accept('No cookie transmitted.', false);
    }
});

// Routes
app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/dashboard', routes.dashboard);
app.get('/leaderboard/:gameName?', routes.leaderboard);
app.get('/memorize', routes.memorize);
app.get('/gpsQuestioning', routes.gpsQuestioning);

app.listen(port, function(){
    logger.info("Express server listening on port " + app.address().port + " in " + app.settings.env + " mode");
});
