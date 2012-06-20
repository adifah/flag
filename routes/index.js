var logger = require('winston');
var users = require('../users');
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
    render('memorize', { title: 'Flag-Zigzag Memorize' }, req, res);
};

exports.leaderboard = function(req, res){
    render('leaderboard', { title: 'Flag-Zigzag Leaderboard', highscores: getHighscores(req) }, req, res);
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

var render = function (view, vars, req, res) {
    // check if user is logged in
    if(typeof req.session.auth == 'undefined') {
        res.redirect("/login");
    } else {
        res.render(view, vars);
    }
};
