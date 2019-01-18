var keystone = require('keystone');

exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  if (req.params.building) {
    view.on('init', function (next) {
      keystone.list('Building').model.find({
        code: req.params.building
      }).exec(function (err, results) {
        locals._id = results[0]._id;
        next(err);
      });
    });
    view.on('init', function (next) {
      keystone.list('Scene').model.find({
        parent: locals._id
      }).exec(function (err, results) {
        locals.items = results;
        next(err);
      });
    });
    locals.nextLevel = 'scene';
  } else if (req.params.location) {
    view.on('init', function (next) {
      keystone.list('Location').model.find({
        code: req.params.location
      }).exec(function (err, results) {
        locals._id = results[0]._id;
        next(err);
      });
    });
    view.on('init', function (next) {
      keystone.list('Building').model.find({
        parent: locals._id
      }).exec(function (err, results) {
        locals.items = results;
        next(err);
      });
    });
    locals.nextLevel = 'building';
  } else {
    view.query('items', keystone.list('Location').model.find());
    locals.nextLevel = 'location';
  }

  // Render the view
  view.render('drilldown');
};
