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
const keystone = require('keystone');
const async = require('async');
const _ = require('lodash');

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
exports.sorterWare = function (req, res, next) {
	let sortKey = req.query.sort || 'name';
	let sortOrder = 'asc';
	if (sortKey[0] === '-') {
		sortOrder = 'desc';
		sortKey = sortKey.split('-')[1];
	}
	const sorted = _.orderBy(
		res.locals.body,
		[
			result => (sortKey === 'createdAt' || sortKey === 'updatedAt')
				? new Date(result[sortKey])
				: result[sortKey].toString().toLowerCase(),
		],
		[sortOrder]
	);
	res.status(res.locals.status).send(sorted);
};

exports.filterByOwner = function (req, res, next) {
	if (req.user) {
		if (req.query.filter) {
			let parsedFilter = JSON.parse(req.query.filter);
			parsedFilter.owner = req.user._id;
			req.query.filter = JSON.stringify(parsedFilter);
		} else {
			req.query.filter = JSON.stringify({ owner: req.user._id });
		}
	}
	next();
};

exports.attachOwner = function (req, res, next) {
	if (req.user && req.body) {
		req.body._req_user = req.user;
		req.body.owner = req.user._id;
	}
	next();
};

function getListByFilter (list, filter) {
	return list.model
		.find(filter)
		.populate({
			path: 'geometry',
			populate: {
				path: 'geometries',
			},
		})
		.populate({
			path: 'properties.building',
			populate: {
				path: 'parent',
				select: 'code',
			},
		})
		.exec();
}

/**
	Formats geographies to include pre-populated metadata
*/
exports.featureCollection = function (req, res, next) {
	const body = res.locals.body;
	const feature = keystone.list('Feature');
	if (body._id) {
		getListByFilter(feature, { group: body._id }).then(result => {
			body.features = result;
			res.status(res.locals.status).json(body);
		});
	} else if (req.query.filter) {
		const filter = JSON.parse(req.query.filter);
		getListByFilter(feature, filter || {}).then(result => {
			res.status(res.locals.status).json(result);
		});
	} else {
		res.status(res.locals.status).json(body);
	}
};

/**
	Formats scenes to include pre-populated linked data
*/
exports.scenePopulate = function (req, res, next) {
	const body = res.locals.body;
	const parallel = [];
	if (body.sceneLinks.length) {
		const Scene = keystone.list('Scene');
		parallel.push(Promise.all(body.sceneLinks.map((sceneLink, index) => {
			return Scene.model
				.findById(sceneLink.scene, 'name code parent')
				.populate({
					path: 'parent',
					select: 'name code parent',
					populate: {
						path: 'parent',
						select: 'name code parent',
					},
				})
				.exec().then(result => {
					if (result) {
						body.sceneLinks[index].path = ['/'];
						if (result.parent) {
							if (result.parent.parent) {
								body.sceneLinks[index].path.push(result.parent.parent.code);
							}
							body.sceneLinks[index].path.push(result.parent.code);
						}
						body.sceneLinks[index].path.push(result.code);
						switch (sceneLink.label) {
							case 'custom':
								body.sceneLinks[index].content = sceneLink.custom;
								break;
							case 'scene':
								body.sceneLinks[index].content = result.name;
								break;
							case 'building':
								body.sceneLinks[index].content = result.parent.name;
								break;
							default:
								body.sceneLinks[index].content
									= ((result.parent && body.parent) && (result.parent._id.toString() !== body.parent._id.toString()))
									? `GO TO:\n${result.parent.name}`
									: false;
								break;
						}
						delete body.sceneLinks[index].custom;
						delete body.sceneLinks[index].label;
						delete body.sceneLinks[index].scene;
					}
				});
		})));
	}
	if (body.hotSpots.length) {
		const Feature = keystone.list('Feature');
		parallel.push(Promise.all(body.hotSpots.map((hotSpot, index) => {
			if (hotSpot.linked && hotSpot.feature) {
				return Feature.model
					.findById(hotSpot.feature, 'location group properties')
					.populate({
						path: 'location',
						select: 'name label code',
					})
					.populate({
						path: 'properties.category group',
						select: 'name',
					})
					.exec().then(result => {
						['name', 'desc'].forEach(prop => delete body.hotSpots[index][prop]);
						body.hotSpots[index].feature = result;
					});
			}
		})));
	}
	if (parallel.length) {
		Promise.all(parallel)
			.then(() => res.status(res.locals.status).json(body))
			.catch(err => console.error('ERROR!', err) && res.status(res.locals.status).json(body));
	} else {
		res.status(res.locals.status).json(body);
	}
};

/**
	Finds documents by their `code` field

	Uses chained arrow function to provide a model type to
	look up for `code` reference
*/
exports.findByCode = type => (req, res, next, value) => {
	const body = res.locals.body;
	const List = keystone.list(type);
	List.model.findByCode(value, function (err, data) {
		if (err) {
			return res.apiError('LookupError', err, `Lookup "${type}" by "${value}" failed`);
		}
		if (!data) {
			return res.apiNotFound();
		}
		req[type] = data;
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

/**
	Prevents non-admins from accessing protected pages
 */
exports.requireKeystoneAccess = function (req, res, next) {
	if (req.user && req.user.canAccessKeystone) {
		next();
	} else {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	}
};
