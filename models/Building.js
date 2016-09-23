var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var Building = new keystone.List('Building');

Building.add({
	name: {
		type: Types.Text,
		initial: true,
		required: true,
		index: true
	},
	code: {
		type: Types.Text,
		initial: true,
		required: true,
		unique: true,
		index: true
	},
	label: {
		type: Types.Text,
		initial: true,
		label: 'Alternative label'
	},
	downtown: {
		type: Types.Boolean,
		initial: true
	},
	desc: {
		type: Types.Html,
		initial: true,
		wysiwyg: true
	},
	location: {
		type: Types.Location,
		initial: true
	},
	default: {
		type: Types.Relationship,
		initial: true,
		required: true,
		ref: 'Scene',
		label: 'Default scene'
	},
	scenes: {
		type: Types.Relationship,
		ref: 'Scene',
		many: true
	}
});

/**
 * Registration
 */
Building.track = true;
Building.defaultColumns = 'name, code, desc, downtown';
Building.register();