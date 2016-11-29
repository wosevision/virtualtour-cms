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
// const Building = keystone.list('Building');
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
	// app.get('/', routes.views.index);

	// app.options('/api*', cors() );
  // app.use('/api*', cors() );
	// enable CORS on api routes
	app.get('/api/v1', function(req, res) {
	  //friendly 'got here' message with version
	  res.status(200).json({
	  	'name': 'virtualtour-server',
	    'version': 0.1
	  });
	});

  const API_DEFAULTS = {
	  ALL: { 
	  	envelop: false,
	  	methods: 'list create update remove',
	  	populate: 'default',
	  	// show: 'name label code parent default panorama'
	  },
	  GET: { 
	  	envelop: false,
	  	methods: 'retrieve',
	  	populate: 'default parent'
	  },
	  GEO: { 
	  	envelop: false,
	  	methods: 'retrieve list create update remove',
	  	populate: 'properties.link geometry geometries geometry.geometries'
	  }
	}

	// init REST API middleware
	restful.expose({
    Location: API_DEFAULTS.ALL,
    Building: API_DEFAULTS.ALL,
    Scene: API_DEFAULTS.ALL
  })
	.expose({
    Location: API_DEFAULTS.GET,
    Building: API_DEFAULTS.GET,
    Scene: API_DEFAULTS.GET
  })
	.expose({
    Entity: { envelop: false },
    Category: { envelop: false },
    Geometry: API_DEFAULTS.GEO,
    Feature: API_DEFAULTS.GEO,
    FeatureCollection: { envelop: false }
  })
  .after('list', {
  	Feature: middleware.featureCollection,
  	FeatureCollection: middleware.sorterWare,
    Location: middleware.sorterWare,
    Building: middleware.sorterWare,
    Scene: middleware.sorterWare
	})
	.after('retrieve', {
		FeatureCollection: middleware.featureCollection
	})
	.start();

	app.get('/drilldown/:location?/:building?', routes.views.drilldown);
	app.get('*', routes.views.index);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
