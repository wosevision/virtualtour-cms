'use strict';
/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
const keystone = require('keystone'),
			_ = require('lodash');

/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
	];
	res.locals.user = req.user;
	next();
};

/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(
		flashMessages,
		msgs => msgs.length
	) ? flashMessages : false;
	next();
};

/**
	Sorts results alphabetically by field specified in `req.query.sort`
*/
exports.sorterWare = function(req, res, next) {
	const sorted = _.orderBy(
		res.locals.body,
		[ result => result[req.query.sort || 'name'].toString().toLowerCase() ],
		['asc']
	);
  res.status(res.locals.status).send(sorted);
}

/**
	Formats geographies to include pre-populated metadata
*/
exports.featureCollection = function(req, res, next) {
	const body = res.locals.body;
  const Feature = keystone.list('Feature');
  if (body._id) {
		Feature.model
			.find({ group: body._id })
			.populate({
				path: 'geometry',
				populate: {
					path: 'geometries'
				}
			})
			.populate('properties.building')
			.exec().then(result => {
				body.features = result;
				res.status(res.locals.status).json(body);
			});
	} else {
		Feature.model
			.find({})
			.populate({
				path: 'geometry',
				populate: {
					path: 'geometries'
				}
			})
			.populate('properties.building')
			.exec().then(result => {
				res.status(res.locals.status).json(result);
			});
	}
}

/**
	Finds documents by their `code` field

	Uses chained arrow function to provide a model type to
	look up for `code` reference
*/
exports.findByCode = type => (req, res, next, value) => {
	const body = res.locals.body;
  const List = keystone.list(type);
  List.model.findByCode(value, function(err, data) {
   	if (err) {
      return res.apiError('LookupError', err, `Lookup "${type}" by "${value}" failed`);
   	}
   	if (!data) {
      return res.apiNotFound();
   	}
    req[type] = data;
		console.log('------------------------------------------------');
		console.log(`Query: "${type}" list by "${value}"`);
		console.log('------------------------------------------------');
    next();
  });
};

/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};
