const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
const Scene = new keystone.List('Scene', {
  // autokey: { path: 'code', from: 'name', unique: true },
  defaultSort: 'parent name code',
  drilldown: 'parent',
	track: true
});

Scene.add('Metadata', {
	name: {
		type: Types.Text,
		initial: true,
		index: true
	},
	code: {
		type: Types.Text,
		initial: true,
		required: true,
		index: true
	},
	parent: {
		type: Types.Relationship,
		label: 'Building',
		ref: 'Building',
		initial: true,
		index: true
	},
	panorama: {
		type: Types.CloudinaryImage,
		autoCleanup: true
		// select : true,
		// selectPrefix: 'scenes/panorama',
		// format: 'auto'
	},
}, 'Tour data', {
	sceneLinks: {
		type: Types.List,
		fields: {
			scene: {
				type: Types.Relationship,
				ref: 'Scene'
			},
			position: {
				type: Types.TextArray,
				default: [ 0, 0, 0 ]
			},
			rotation: {
				type: Types.TextArray,
				default: [ 0, 90, 70 ]
			}
		}
	},
	hotSpots: {
		type: Types.List,
		fields: {
			name: {
				type: Types.Text
			},
			content: {
				type: Types.Html,
				wysiwyg: true
			},
			position: {
				type: Types.TextArray
			}
		}
	}
}, 'Advanced', {
	assets: {
		type: Types.Relationship,
		ref: 'Entity',
		many: true
	},
	entities: {
		type: Types.Relationship,
		ref: 'Entity',
		many: true
	},
	script: {
		type: Types.Code,
		label: 'Javascript',
		language: 'js'
	}
});

/**
 * Registration
 */
Scene.defaultColumns = 'name, parent, code|10%';
Scene.register();