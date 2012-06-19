var db = require('dirty')('user.db'); // read 'user.db' file into memory or create one if not present

exports.getUser = function(id) {
    return db.get(id);
};

exports.setUser = function(id, data) {
    set(id, data);   
}


exports.setScore = function(id, data) {
    var user = db.get(id);
    var score = user.score;
    if(score == null) {
        score = 0;
    }
    if(data.score > score) {
        set(id, {'score': data.score});
    }
}

// increments the logins count
exports.incrementLogins = function(id) {
    var user = db.get(id);
    var logins = user.logins;
    if(logins == null) { //broken
        logins = 0;
    }
    logins++;
    set(id, {'logins': logins});
};

// returns an array of users descending by score for a given game
exports.getHighscores = function(data) {
    var gameName = data.gameName;
    var highscores = [];
    // get score from each user
    db.forEach(function(key, val) {
        // TODO: check for gameName here
        var name = val.twitter.screen_name;
        var score = val.score;
        if(score == null) {
            score = 0;
        }
        highscores[name] = score;
    });
    // sort users descending by score
    highscores.sort(function(a,b){return b-a});
    return highscores;
}

var set = function (id, data) {
    var user = db.get(id);
    if(user==null) {
        user = {};
    }
    for(var d in data) {
        if(data.hasOwnProperty(d)) {
            user[d] = data[d];
        }
    }
    console.log("set key: " + id + ", value: " + user);
    db.set(id, user);
}