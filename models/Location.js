const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
const Location = new keystone.List('Location');

Location.add('Metadata', {
	name: {
		type: Types.Text,
		required: true,
		initial: true,
		index: true,
	},
	label: {
		type: Types.Text,
		initial: true,
		label: 'Short name'
	},
	code: {
		type: Types.Text,
		initial: true,
		required: true,
		unique: true,
		index: true
	},
}, 'References', {
	default: {
		type: Types.Relationship,
		initial: true,
		// required: true,
		ref: 'Scene',
		label: 'Default scene'
	}
});

Location.relationship({ path: 'buildings', ref: 'Building', refPath: 'parent' });

// Provide access to Keystone
// Location.schema.virtual('canAccessKeystone').get(function () {
// 	return this.isAdmin;
// });


/**
 * Registration
 */
Location.defaultColumns = 'name, code';
Location.register();
