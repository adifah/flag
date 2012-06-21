var db = require('dirty')('user.db'); // read 'user.db' file into memory or create one if not present

exports.getUser = function(id) {
    return db.get(id);
};

exports.setUser = function(id, data) {
    set(id, data);   
}


exports.setScore = function(id, data) {
    var user = db.get(id);
    var gameName = data.gameName;
    var gameData = user[gameName];
    if(gameData == null) {
        gameData = {"score": 0};
    }
    if(data.score > gameData.score) {
        var newHighscore = {};
        newHighscore[gameName] = {"score": data.score};
        set(id, newHighscore);
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
    console.log("gameName: " + gameName);
    var highscores = [];
    // get score from each user
    db.forEach(function(key, val) {
        var name = val.twitter.screen_name;
        // only get points for the given game
        var game = val[gameName];
        // only add users that already played the game
        if(game != null) {
            var score = val[gameName].score;
            if(score == null) {
                score = 0;
            }
            highscores[name] = score;
        }
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