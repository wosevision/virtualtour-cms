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

const cors = require('cors'),
			keystone = require('keystone'),
			importRoutes = keystone.importer(__dirname),
			middleware = require('./middleware');

const api = require('restful-keystone')(keystone, {
  root: '/api/v1'
});

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
const routes = {
	views: importRoutes('./views'),
	auth: importRoutes('./auth'),
	api: importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = app => {

	// API v1 binding
	const apiRoutes = routes.api.v1;

	if (process.env.NODE_ENV !== 'production') {
		console.log('------------------------------------------------');
		console.log('Notice: Enabling CORS for development.');
		console.log('------------------------------------------------');
		app.options('/api*', cors() );
	  app.use('/api*', cors() );
	}

	// Server-built partials
	app.get('/dashboard', routes.views.dashboard);

	// Authorization routes
	app.use('/user', routes.auth.index.router(routes.auth));
	
	// API routes
	apiRoutes.index._initRest(api);
	app.use('/api/v1', apiRoutes.index.router(apiRoutes));

	// Views (handled by Angular)
	app.get('*', routes.views.index);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
};
