/**
 * Module dependencies.
 */

var express = require('express')
  , everyauth = require('everyauth')
  , conf = require('./conf')
  , db = require('dirty')('user.db') // read 'user.db' file into memory or create one if not present
  , routes = require('./routes');

var port = process.env.C9_PORT || process.env.PORT || 3000; // process.env.C9_PORT is for c9.io, process.env.PORT is for heroku, 3000 for everything else

everyauth.everymodule // delivers the correct session for every http request
    .findUserById( function (id, callback) {
        console.log("find user: " + id);
        callback(null, db.get(id));
    });
  
everyauth.twitter
    .consumerKey(conf.twit.consumerKey)
    .consumerSecret(conf.twit.consumerSecret)
    .findOrCreateUser( function (sess, accessToken, accessSecret, twitUser) {
        // check if a user with this twitter id already exists in tht db
        var user = db.get(twitUser.id);
        if(user === undefined) {
            console.log("create user: " + twitUser.id);
            db.set(twitUser.id, createUser('twitter', twitUser));
            user = db.get(twitUser.id);
        }
        console.log("return user: " + twitUser.id);
        return user;
    })
    .redirectPath('/');

function createUser(source, sourceUser) {
    var user = {id: sourceUser.id};
    user[source] = sourceUser;
    return user;
}

everyauth.debug = true;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.cookieParser()); // allows dealing with cookies
    app.use(express.session({secret: 'fsln12team3'})); //passphrase to hash the session
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(everyauth.middleware()); // allows express helpers determining the login status or accessing user details
    everyauth.helpExpress(app); // allows using helper methods in express views (like everyauth.loggedIn)
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(port, function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
