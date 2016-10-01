// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
const keystone = require('keystone'),
    fs = require('fs');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'UOIT Virtual Tour',
	'brand': 'UOIT Virtual Tour',

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'pug',

	'emails': 'templates/emails',

	'auto update': true,
	'session': true,
	'session store': 'mongo',
	'auth': true,
	'user model': 'User',
});

keystone.set('static', 'panoramas');

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.
keystone.set('email locals', {
	logo_src: '/images/logo-email.gif',
	logo_width: 194,
	logo_height: 76,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7',
		},
	},
});

// Load your project's email test routes
keystone.set('email tests', require('./routes/emails'));

// Bind Google API keys for location lookups
// Set automatically to process.env.GOOGLE_BROWSER_KEY
// and process.env.GOOGLE_SERVER_KEY
keystone.set('google api key', process.env.GOOGLE_BROWSER_KEY);
keystone.set('google server api key', process.env.GOOGLE_SERVER_KEY);
keystone.set('default region', 'ca');

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	'location data': ['locations', 'buildings', 'scenes'],
	'tour data': ['panoramas', 'entities'],
	'user management': 'users',
});

// Start Keystone to connect to your database and initialise the web server
keystone.start();

// fs.writeFileSync('api.md', keystoneRestApi.apiDocs(), 'UTF-8');
