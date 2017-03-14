// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config({ path: __dirname + '/.env' });

// Require keystone
const keystone = require('keystone'),
    	log = require('./utils/log'),
    	ejs = require('ejs');
    	// fs = require('fs');
    	
// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	// meta
	'name': 'UOIT Virtual Tour',
	'brand': 'UOIT Virtual Tour',
	// templates
	'sass': 'public',
	'static': 'public',
	'static options': { maxAge: '200d' },
	'favicon': 'public/icons-cf06493c3c6774a5839aed2c41a0a2a4/favicon.ico',
	'views': 'templates/views',
	'view engine': 'ejs',
	'custom engine': ejs.renderFile,
	// mail
	'emails': 'templates/emails',
	// db
	'auto update': true,
	'session': true,
	'session store': 'mongo',
	'compress': true,
	// auth
	'auth': true,
	'user model': 'User',
	'cookie secret': process.env.COOKIE_SECRET,
	'signin redirect': '/',
	'signout redirect': '/',
	//
	logger: 'dev'
});

if (process.env.NODE_ENV !== 'production') {
	keystone.set('ssl', true);
	keystone.set('ssl port', 3001);
	keystone.set('ssl key', './certificates/server.key');
	keystone.set('ssl cert', './certificates/server.crt');
	keystone.set('ssl ca', './certificates/server.csr');

	log.note('Self-signed SSL enabled for development – use Nginx in production.');
}

// keystone.set('static', 'panoramas');

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

// Cloudinary setup
keystone.set('cloudinary config', process.env.CLOUDINARY_URL);
keystone.set('cloudinary folders', true);
keystone.set('cloudinary secure', true);

// WYSIWYG config
keystone.set('wysiwyg images', true);
keystone.set('wysiwyg cloudinary images', true);

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	'location data': ['locations', 'buildings'],
	'tour data': ['scenes', 'entities'],
	'map data': ['feature-collections', 'categories', 'features', 'geometries'],
	'users': 'users'
});

// Load UI template file
// const buffer = fs.readFileSync('node_modules/keystone/admin/server/templates/index.html');
// const content = buffer.toString();
// const styleLink = '<link rel="stylesheet" href="/styles/admin.css">';
// // If already links to our stylesheet we have nothing else to do
// if (!content.includes(styleLink)) {
// 	// Add link to our stylesheet at the end of <head>
// 	const newContent = content.replace('</head>', `${styleLink} \n </head>`);
// 	fs.writeFileSync('node_modules/keystone/admin/server/templates/index.html', newContent);
// }


// Start Keystone to connect to your database and initialise the web server
keystone.start();
