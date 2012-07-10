var db = require('dirty')('user.db'); // read 'user.db' file into memory or create one if not present

exports.getUser = function(id) {
    return db.get(id);
};

exports.setUser = function(id, data) {
    set(id, data);   
};


exports.setScore = function(id, data) {
    var user = db.get(id);
    var gameName = data.gameName;

    // get gameData or init it
    var gameData = user[gameName];
    if(gameData == null) {
        gameData = {"score": 0, "time": 0};
    }
    
    // get levelData or init it
    var levelData = gameData[data.level];
    if(levelData == null) {
        levelData = {"score": 0, "time": 0};
    }
    
    // set level highscore (and recalculate total game highscore)
    if(data.score > levelData.score) {
        setLevelHighscore(id, data, gameData);
    }
    if(data.score == levelData.score) {
        if(data.time < levelData.time) {
            setLevelHighscore(id, data, gameData);
        }
    }
};

function setLevelHighscore(id, data, gameData) {
    var newHighscore = {};
    newHighscore[data.gameName] = gameData;
    newHighscore[data.gameName][data.level] = {"score": data.score, "time": data.time};
    set(id, newHighscore);
    // if levelHighscore changed, recalculate the total game highscore
    setGameHighscore(id, data);
}

function setGameHighscore(id, data) {
    var user = db.get(id),
        gameName = data.gameName,
        gameData = user[gameName],
        totalScore = 0,
        totalTime = 0;
        
    // check if user already collect some points
    if(gameData == null) {
        gameData = {"score": 0, "time": 0};
    }
        
    // iterate over all level highscores    
    for(var i=1; i<=3; i++) {
        var currentLevel = gameData[i] || null;
        if(currentLevel != null) {
            var levelScore = currentLevel.score || 0;
            var levelTime = currentLevel.time || 0;
            totalScore += levelScore;
            totalTime += levelTime;
        }
    }
    
    // set the new total highscore
    var newHighscore = {};
    newHighscore[gameName] = gameData;
    newHighscore[gameName].score = totalScore;
    newHighscore[gameName].time = totalTime;
    set(id, newHighscore);  
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
        // only get points for the given game
        var game = val[gameName];
        // only add users that already played the game
        if(game != null) {
            var user = {};
            user.name = val.twitter.screen_name;
            user.score = val[gameName].score;
            user.time = val[gameName].time;
            if(user.score == null) {
                user.score = 0;
            }
            if(user.time == null) {
                user.time = 0;
            }
            highscores.push(user);
        }
    });
    // sort users descending by score
    highscores.sort(function(a,b){
        if (a.score > b.score) {
            return -1;
        }
        if (a.score < b.score) {
            return 1;
        }
        if (a.score == b.score) {
            if (a.time > b.time) {
                return 1;
            }
            if (a.time < b.time) {
                return -1;
            }
        }
        return 0;
    });
    return highscores;
};

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