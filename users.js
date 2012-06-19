var db = require('dirty')('user.db'); // read 'user.db' file into memory or create one if not present

exports.getUser = function(id) {
    return db.get(id);
};

exports.addUser = function(id, data) {
    db.set(id, data);
};

exports.setScore = function(id, data) {
    db.set(id, data);
}

exports.incrementLogins = function(id) {
    var user = db.get(id);
    var logins = user.logins;
    if(isNaN(logins)) { //broken
        logins = 0;
    }
    db.set(id, {'logins': ++logins});
};