var everyauth = require('everyauth')
  , logger = require('winston')
  , conf = require('./conf')
  , db = require('dirty')('user.db'); // read 'user.db' file into memory or create one if not present

everyauth.everymodule // delivers the correct session for every http request
    .findUserById( function (id, callback) {
        console.log("search user: " + id);
        callback(null, db.get(id));
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
        var user = db.get(twitUser.id);
        if(user === undefined) {
            console.log("create user: " + twitUser.id);
            db.set(twitUser.id, createUser('twitter', twitUser));
            user = db.get(twitUser.id);
        }
        var logins = ++user.logins;
        db.set(twitUser.id, {logins : logins});
        console.log("return user: " + twitUser.id + " (" + user.logins + " logins)");
        return user;
    })
    .redirectPath('/dashboard');

function createUser(source, sourceUser) {
    var user = {};
    user['id'] = sourceUser.id;
    user[source] = sourceUser;
    user['logins'] = 0;
    return user;
}