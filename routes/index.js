var logger = require('winston');
var users = require('../users');
var conf = require('../conf');

/*
 * GET home page.
 */

// redirecting the user either to /login or /dashboard
exports.index = function(req, res){
    // check if user is logged in
    if(typeof req.session.auth == 'undefined') {
        res.redirect("/login");
    } else {
        res.redirect("/dashboard");
    }
};

exports.login = function(req, res){
    logger.info("new user");
    res.render('login', { title: 'Flag-Zigzag Login' });
};

exports.dashboard = function(req, res){
    render('dashboard', { title: 'Flag-Zigzag Dashboard' }, req, res);
};

exports.memorize = function(req, res){
    render('memorize', { title: 'Flag-Zigzag Memorize', 'unlockedLevels': getUnlockedLevels(req, 'memorize'), 'score': getScore(req, 'memorize') }, req, res);
};

exports.gpsQuestioning = function(req, res){
    render('gpsQuestioning', { title: 'Flag-Zigzag GPS-Questioning', 'unlockedLevels': getUnlockedLevels(req, 'gpsQuestioning'), 'score': getScore(req, 'gpsQuestioning') }, req, res);
};

exports.leaderboard = function(req, res){
    render('leaderboard', { title: 'Flag-Zigzag Leaderboard', 'highscores': getHighscores(req), 'gameName': req.params.gameName }, req, res);
};

var getHighscores = function (req) {
    // get game name here
    var gameName = req.params.gameName;
    if(gameName==null) {
        return null;   
    } else {
        return users.getHighscores({"gameName": gameName});
    }
}

var getScore = function (req, gameName) {
    var userScore = 0;
    if(typeof req.session.auth != 'undefined') {
        var userId = req.session.auth.userId;
        var user = users.getUser(userId);
        if(user != null) {
            var gameData = user[gameName];
            if(gameData != null) {
                userScore = gameData.score;
            }
        }
    }
    return userScore
}

var getUnlockedLevels = function (req, gameName) {
    var unlockedLevels = 0;
    var userScore = getScore(req, gameName);
    var pointsForLevelOne = conf[gameName]['level1'].pointsRequired;
    var pointsForLevelTwo = conf[gameName]['level2'].pointsRequired;
    var pointsForLevelThree = conf[gameName]['level3'].pointsRequired;
    if(userScore>=pointsForLevelOne)
        unlockedLevels = 1;
    if(userScore>=pointsForLevelTwo)
        unlockedLevels = 2;
    if(userScore>=pointsForLevelThree)
        unlockedLevels = 3;
    return unlockedLevels;
}

var render = function (view, vars, req, res) {
    // check if user is logged in
    if(typeof req.session.auth == 'undefined') {
        res.redirect("/login");
    } else {
        res.render(view, vars);
    }
};
