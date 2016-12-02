var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User', {
	track: true,
	autokey: { path: 'userId', from: 'name', unique: true },
	map: { name: 'name.full' }
});

User.add({
	name: {
		type: Types.Name,
		required: true,
		index: true,
		initial: true
	},
	avatar: { 
		type: Types.CloudinaryImage,
		collapse: true,
		folder: 'user/avatars',
		publicID: 'userId',
		autoCleanup : true,
		select : true
	},
	email: {
		type: Types.Email,
		initial: true,
		required: true,
		index: true
	},
	password: {
		type: Types.Password,
		initial: true,
		required: true
	},
}, 'Permissions', {
	isAdmin: {
		type: Boolean,
		noedit: true,
		label: 'Administrator',
		index: true
	},
	isEditor: {
		type: Boolean,
		// noedit: true,
		label: 'Editor',
		index: true
	},
	isContributor: {
		type: Boolean,
		// noedit: true,
		label: 'Contributor',
		index: true
	}
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return (this.isContributor || this.isEditor || this.isAdmin);
});

User.schema.methods.wasActive = function () {
	this.lastActiveOn = new Date();
	return this;
}

User.schema.virtual('avatarTag').get(function () {
	return this._.avatar.tag();
});

// User.relationship({ path: 'drafts', ref: 'Draft', refPath: 'owner' });


/**
 * Registration
 */
User.defaultColumns = 'name, email, isContributor|12%, isEditor|12%, isAdmin|12%';
User.register();
