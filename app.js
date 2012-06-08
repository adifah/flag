/**
 * Module dependencies.
 */

var express = require('express')
  , everyauth = require('everyauth')
  , auth = require('./auth')
  , conf = require('./conf')
  , routes = require('./routes')
  , logger = require('winston')
  , loggly = require('winston-loggly');  // Requiring `winston-loggly` will expose `winston.transports.Loggly`

logger.add(logger.transports.File, conf.logger.file);
logger.add(logger.transports.Loggly, conf.logger.loggly);

var port = process.env.C9_PORT || process.env.PORT || 3000; // process.env.C9_PORT is for c9.io, process.env.PORT is for heroku, 3000 for everything else

everyauth.debug = false;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.cookieParser()); // allows dealing with cookies
    app.use(express.session({secret: 'fsln12team3'})); //passphrase to hash the session
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

// Routes

app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/dashboard', routes.dashboard);
app.get('/memorize', routes.memorize);

app.listen(port, function(){
    logger.info("Express server listening on port " + app.address().port + " in " + app.settings.env + " mode");
});
