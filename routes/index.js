
/*
 * GET home page.
 */

exports.dashboard = function(req, res){
    if(typeof req.session.auth == 'undefined') {
        res.redirect("/");
    } else {
        res.render('dashboard', { title: 'Flag-Zigzag Dashboard' });
    }
};
exports.index = function(req, res){
    if(typeof req.session.auth == 'undefined') {
        res.render('index', { title: 'Flag-Zigzag' });
    } else {
        res.redirect("/dashboard");
    }
};
