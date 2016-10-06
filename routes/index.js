/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */
'use strict';

const keystone = require('keystone'),
			middleware = require('./middleware'),
			importRoutes = keystone.importer(__dirname),
			cors = require('cors');

const restful = require('restful-keystone')(keystone, {
    root: '/api/v1'
});

// FOR REMOVING SCHEMA PROPERTIES
// 
// var Building = keystone.list('Building');
// Building.model.update({},
// 	{ $unset: { location: 1, locationRef: 1, downtown: 1, geo: 1, scenes: 1 }},
//   { multi: true, safe: true}, err => {
// 		console.log(err);
// 	}
// );

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
const routes = {
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = app => {
	// Views
	app.get('/', routes.views.index);

	app.options('/api*', cors() );
  app.use('/api*', cors() );
	// enable CORS on api routes

	const sorterWare = function(req, res, next) {
  	// console.log(req.query);
  	if (req.query.hasOwnProperty('sort')) {
  		res.locals.body.sort((a, b) =>{
				let propA = a[req.query.sort].toString().toLowerCase(), 
						propB = b[req.query.sort].toString().toLowerCase();
				if (propA < propB) return -1;
				if (propA > propB) return 1;
				return 0;
			});
  	}
    res.status(res.locals.status).send(res.locals.body);
  }

  const REST_DEFAULTS = { 
  	envelop: false,
  	methods: true,
  	populate: 'default'
  }

	// init REST API middleware
	restful.expose({
    Location: REST_DEFAULTS,
    Building: REST_DEFAULTS,
    Scene: REST_DEFAULTS, //populate: 'sceneLinks.scene'
    Entity: true
  })
  // .before({
  // 	Building(req, res, next) {
  // 		// console.log(res);
  // 		next();
  // 	}
  // })
  .after("list", {
    Location: sorterWare,
    Building: sorterWare,
    Scene: sorterWare
	}).start();

	// POST logger (test)
	// app.post('/', function (req, res) {
	// 	console.log(req.body);
	// 	res.send(JSON.stringify(req.body));
	// });

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
