var everyauth = require('everyauth')
  , logger = require('winston')
  , conf = require('./conf')
  , users = require('./users'); // read 'user.db' file into memory or create one if not present

everyauth.everymodule // delivers the correct session for every http request
    .findUserById( function (id, callback) {
        console.log("search user: " + id);
        callback(null, users.getUser(id));
    })
    .moduleErrback( function (err) {
        logger.error("Internal error '" + err + "' on authentication: ");
    });
    
everyauth.twitter
    .consumerKey(conf.twit.consumerKey)
    .consumerSecret(conf.twit.consumerSecret)
    .moduleErrback( function (err) {
        console.log("Internal error '" + err + "' on authentication: ");
    })
    .findOrCreateUser( function (sess, accessToken, accessSecret, twitUser) {
        // check if a user with this twitter id already exists in tht db
        users.setUser(twitUser.id, createUser('twitter', twitUser));
        var user = users.getUser(twitUser.id);
        users.incrementLogins(twitUser.id);
        console.log("return user: " + twitUser.id + " (" + user.logins + " logins)");
        return user;
    })
    .redirectPath('/dashboard');

function createUser(source, sourceUser) {
    var user = {};
    user['id'] = sourceUser.id;
    user[source] = sourceUser;
    return user;
}