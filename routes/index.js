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

const cors = require('cors');
const keystone = require('keystone');
const helmet = require('helmet');
const importRoutes = keystone.importer(__dirname);
const middleware = require('./middleware');

const {
  inspect
} = require('util');
const {
  log
} = require('../utils');

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);
keystone.pre('static', helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", '*.aframe.io', 'ws://localhost:3002', 'ontariotechu.ca', '*.ontariotechu.ca'],
      imgSrc: [
        "'self'", 'data:', '*',
        // '*.gstatic.com', '*.doubleclick.net', '*.googleapis.com', 'www.google-analytics.com', 'www.google.com', 'www.google.ca',
        // '*.cloudinary.com', '*.ontariotechu.ca', '*.aframe.io'
      ],
      mediaSrc: ["'self'", 'data:'],
      fontSrc: ["'self'", 'data:', 'maxcdn.bootstrapcdn.com', 'fonts.gstatic.com', '*.ontariotechu.ca'],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'www.google-analytics.com', '*.googleapis.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'blob:', 'fonts.googleapis.com', 'maxcdn.bootstrapcdn.com'],
      reportUri: '/csp-violation',
    },
    reportOnly: (process.env.NODE_ENV !== 'production'),
  },
  frameguard: false
}));

// Import Route Controllers
const routes = {
  views: importRoutes('./views'),
  auth: importRoutes('./auth'),
  api: importRoutes('./api'),
};

// Setup Route Bindings
exports = module.exports = app => {
  // API v1 binding
  const apiRoutes = routes.api.v1;
  const apiInit = require('restful-keystone')(keystone, {
    root: '/api/v1',
  });

  if (process.env.NODE_ENV !== 'production') {
    app.options('/api*', cors());
    app.use('/api*', cors());
    log.warn('CORS enabled for development purposes only. ', 'Do not enable in production.');
  }

  app.post('/csp-violation', (req, res) => {
    if (req.body) {
      log.error('CSP Violation: ', inspect(req.body));
    } else {
      log.error('CSP Violation: No data received!');
    }
    res.status(204).end();
  });

  // Authorization routes
  app.use('/user', routes.auth.index.router(routes.auth));

  // API routes
  apiRoutes.index.init(apiInit);
  app.use('/api/v1', apiRoutes.index.router(apiRoutes));

  // Views (handled by Angular)
  app.get('*', routes.views.index);

  // NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
  // app.get('/protected', middleware.requireUser, routes.views.protected);
};
