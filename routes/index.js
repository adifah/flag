var logger = require('winston');
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

var render = function (view, vars, req, res) {
    // check if user is logged in
    if(typeof req.session.auth == 'undefined') {
        res.redirect("/login");
    } else {
        res.render(view, vars);
    }
};
