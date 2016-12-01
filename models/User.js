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
	name: { type: Types.Name, required: true, index: true },
	avatar: { type: Types.CloudinaryImage, folder: 'user/avatars', publicID: 'userId', autoCleanup : true, select : true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});
User.schema.virtual('avatarTag').get(function () {
	return this._.avatar.tag();
});


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
