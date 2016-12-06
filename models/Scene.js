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

Scene.add('Metadata',{
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
		autoCleanup: true,
		select : true,
		selectPrefix: 'scenes/panorama',
		format: 'auto'
	},
}, 
'Tour data', 
{
	sceneLinks: {
		type: Types.List,
		fields: {
			scene: {
				type: Types.Relationship,
				ref: 'Scene'
			},
			position: {
				type: Types.NumberArray,
				default: [ 0, 0, 0 ]
			},
			rotation: {
				type: Types.NumberArray,
				default: [ 0, 0, 70 ]
			}
		}
	},
	hotSpots: {
		type: Types.List,
		fields: {
			linked: {
				type: Types.Boolean,
				label: 'Link to a campus map feature?',
				default: false
			},
			feature: {
				type: Types.Relationship,
				label: 'Feature link',
				ref: 'Feature',
				dependsOn: { 'linked': true }
			},
			name: {
				type: Types.Text,
				dependsOn: { 'linked': false }
			},
			content: {
				type: Types.Html,
				wysiwyg: true,
				dependsOn: { 'linked': false }
			},
			position: {
				type: Types.NumberArray
			}
		}
	}
}, 
'Advanced', 
{
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

Scene.schema.statics.findByCode = function (code, cb) {
  return this.findOne({ code: code }, cb);
}

/**
 * Registration
 */
Scene.defaultColumns = 'name, parent, code|10%';
Scene.register();