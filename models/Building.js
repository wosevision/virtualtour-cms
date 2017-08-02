const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Building Model
 * ==========
 */
const Building = new keystone.List('Building', {
  defaultSort: '-parent name',
  drilldown: 'parent',
	track: true
});

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
		type: Types.Key,
		note: 'Used for unique identification (such as in URLs). No special characters.',
    separator: '_',
    width: 'small',
		initial: true,
		required: true,
		unique: true,
		index: true,
    lowercase: true
	},
  state: {
    type: Types.Select,
    options: 'draft, published, archived',
    default: 'published',
    index: true
  },
}, 'Content', {
	desc: {
		type: Types.Html,
		label: 'Description',
		initial: true,
		wysiwyg: true
	}
}, 'Relationships', {
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

Building.schema.statics.findByCode = function (code, cb) {
  return this.findOne({ code: code }, cb);
}

/**
 * Registration
 */
Building.track = true;
Building.defaultColumns = 'name, code|10%, parent|30%, default|20%';
Building.register();