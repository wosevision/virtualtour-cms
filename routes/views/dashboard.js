var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	// var user = res.locals.user;

	// Render the view
	view.render('dashboard');
  // Just send the index.html for other files to support HTML5Mode
  // res.render('index.html', { root: __dirname });
};
