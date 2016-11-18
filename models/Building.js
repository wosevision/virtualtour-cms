const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
const Building = new keystone.List('Building', {
  // map: { name: 'label' },
  defaultSort: '-parent name',
  drilldown: 'parent',
	track: true
});
// , {
// 	rest: true,
// 	restOptions: 'list show create update delete'
// }

Building.add('Metadata', {
	name: {
		type: Types.Text,
		initial: true,
		required: true,
		index: true
	},
	label: {
		type: Types.Text,
		initial: true,
		label: 'Short name'
	},
	code: {
		type: Types.Text,
		note: 'Used for unique identification (such as in URLs). No special characters.',
		initial: true,
		required: true,
		unique: true,
		index: true
	},
}, 'Content', {
	desc: {
		type: Types.Html,
		initial: true,
		wysiwyg: true
	}//,
	// coords: {
	// 	type: Types.GeoPoint,
	// 	initial: true
	// }
}, 'Relationships', {
	// geo: {
	// 	type: Types.Relationship,
	// 	label: 'Geography',
	// 	ref: 'Geography'
	// },
	parent: {
		type: Types.Relationship,
		label: 'Campus location',
		ref: 'Location',
		required: true,
		initial: true
	},
	default: {
		type: Types.Relationship,
		note: 'Loaded as the first scene of this building. Note: a building needs a default scene before it can be properly navigated to.',
		filters: { parent: ':_id' },
		// required: true,
		initial: true,
		ref: 'Scene',
		label: 'Default scene'
	}
});

Building.relationship({ path: 'scenes', ref: 'Scene', refPath: 'parent' });
Building.relationship({ path: 'features', ref: 'Feature', refPath: 'properties.building' });

/**
 * Registration
 */
Building.track = true;
Building.defaultColumns = 'name, code|10%, desc, parent|30%';
Building.register();