var keystone = require('keystone');
const contentHashFilename = require('keystone-storage-namefunctions').contentHashFilename;
const Types = keystone.Field.Types;

const storage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: keystone.expandPath('./uploads/avatars'), // required; path where the files should be stored
		publicPath: '/user/avatar/', // path where files will be served,
		generateFilename: contentHashFilename,
		whenExists: 'overwrite',
	},
	schema: {
		size: true,
		mimetype: false,
		path: false,
		originalname: true,
		url: true,
	},
});

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User', {
	track: true,
	autokey: { path: 'userId', from: 'name', unique: true },
	map: { name: 'name.full' },
});

User.add({
	name: {
		type: Types.Name,
		required: true,
		index: true,
		initial: true,
	},
	avatar: {
		type: Types.File,
		initial: true,
		storage,
	},
	bannerId: {
		type: Number,
		label: 'Banner ID',
		initial: true,
		index: true,
		sparse: true,
	},
	email: {
		type: Types.Email,
		initial: true,
		required: true,
		index: true,
	},
	password: {
		type: Types.Password,
		initial: true,
		required: true,
	},
}, 'Preferences', {
	settings: {
		toolbarOpen: {
			type: Boolean,
			label: 'Toolbar open by default',
			note: 'Keeps the right-hand button toolbar and menus within the Virtual Tour open upon loading',
			default: true,
		},
		toolbarCondensed: {
			type: Boolean,
			label: 'Toolbar condensed by default',
			note: 'Condenses the right-hand button toolbar into a smaller version with no labels',
			default: false,
		},
		showHints: {
			type: Boolean,
			label: 'Show hint messages',
			note: 'Displays informational popups over certain tour controls when hovering',
			default: true,
		},
		showWelcome: {
			type: Boolean,
			label: 'Always show welcome message',
			note: 'Displays the Virtual Tour welcome & tutorial dialog on every visit',
			default: true,
		},
	},
	usage: {
		auto: {
			type: Boolean,
			label: 'Auto-detect optimum data usage settings',
			note: 'Uses device and network connection information to determine the most efficient compression and preloading settings for your scenario',
			default: true,
		},
		compression: {
			label: 'Image compression',
			note: 'Adjusts the level of compression applied to panorama images. 10 = smallest file size, but lowest quality & longer reponse time. 1 = highest quality and lowest response time, but largest file size.',
			type: Number,
			min: 1,
			max: 10,
			default: 2,
		},
		preloading: {
			label: 'Preloading strategy',
			note: 'Adjusts the manner in which the tour pre-emptively loads panoramas. 0 = no preloading. 1 = adjacent scenes are preloaded one at a time. 2 = preloaded at once.',
			type: Number,
			min: 0,
			max: 2,
			default: 2,
		},
		// cache: {
		// 	label: 'Cache control',
		// 	note: 'Adjusts the maximum amount of data that the tour is allowed to cache in the browser. More = less reloading data. Less = less storage used on device.',
		// 	type: Number,
		// 	min: 0,
		// 	max: 250,
		// 	default: 150
		// },
		resolution: {
			label: 'Image resolution',
			note: 'Switches the tour scene panoramas between low and high resolution mode. High = sharp image, slower loading. Low = Faster load, pixellation.',
			type: Number,
			min: 0,
			max: 1,
			default: 1,
		},
	},
}, 'Permissions', {
	isAdmin: {
		type: Boolean,
		initial: true,
		noedit: true,
		label: 'Administrator',
		index: true,
	},
	isEditor: {
		type: Boolean,
		initial: true,
		noedit: true,
		label: 'Editor',
		index: true,
	},
	isContributor: {
		type: Boolean,
		initial: true,
		noedit: true,
		label: 'Contributor',
		index: true,
	},
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return (this.isContributor || this.isEditor || this.isAdmin);
});

User.schema.methods.wasActive = function () {
	this.lastActiveOn = new Date();
	return this;
};

User.schema.virtual('avatarTag').get(function () {
	return this._.avatar.tag();
});

// User.relationship({ path: 'drafts', ref: 'Draft', refPath: 'owner' });


/**
 * Registration
 */
User.defaultSort = 'name bannerId';
User.defaultColumns = 'avatar|10%, name, email, isContributor|10%, isEditor|10%, isAdmin|10%, bannerId';
User.register();
