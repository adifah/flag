
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: 'Flag-Zigzag' })
};

exports.dashboard = function(req, res){
    console.log(req.user);
    res.render('dashboard', { title: 'Flag-Zigzag' })
};