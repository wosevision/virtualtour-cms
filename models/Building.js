const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
const Building = new keystone.List('Building', {
    // map: { name: 'label' },
    defaultSort: 'parent name',
    drilldown: 'parent'
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
	},
	coords: {
		type: Types.GeoPoint,
		initial: true
	}
}, 'References', {
	// scenes: {
	// 	type: Types.Relationship,
	// 	many: true,
	// 	label: 'Scenes',
	// 	ref: 'Scene'
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
		// required: true,
		ref: 'Scene',
		label: 'Default scene'
	}
});

Building.relationship({ path: 'scenes', ref: 'Scene', refPath: 'parent' });

const POPULATORS = {
	getSelf(next) {
	  this
	  	// .select('name label code desc coords parent default')
	  	.populate('default');
	  next();
	},
	getParent(next) {
	  this
	  	.populate('parent', 'code');
	  next();
	}
}

// Building.schema.pre('findOne', POPULATORS.getSelf);
// Building.schema.pre('find', POPULATORS.getParent);

/**
 * Registration
 */
Building.track = true;
Building.defaultColumns = 'name, code|10%, desc, locationRef|20%';
Building.register();