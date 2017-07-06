const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
const Location = new keystone.List('Location', {
	nocreate: true,
	track: true
});

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
    type: Types.Key,
    note: 'Used for unique identification (such as in URLs). No special characters.',
    separator: '_',
    width: 'small',
    initial: true,
    required: true,
    index: true,
    lowercase: true
  },
}, 'References', {
	default: {
		type: Types.Relationship,
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
Location.defaultColumns = 'name, code|10%, default';
Location.register();
