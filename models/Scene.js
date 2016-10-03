const keystone = require('keystone');
const Types = keystone.Field.Types;
const validators = require('./validators');

/**
 * User Model
 * ==========
 */
const Scene = new keystone.List('Scene', {
  // autokey: { path: 'code', from: 'name', unique: true },
  defaultSort: 'parent code',
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
		ref: 'Building'
	},
	sceneLinks: {
		type: Types.List,
		fields: {
			scene: {
				type: Types.Relationship,
				ref: 'Scene'
			},
			position: {
				type: Types.TextArray
			},
			rotation: {
				type: Types.TextArray
			}
		}
	},
	hotSpots: {
		type: Types.List,
		fields: {
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

const POPULATORS = {
	getSelf(next) {
	  this
	  	.select('entities assets sceneLinks')
	  	.populate('entities assets')
	  	.populate('parent', 'code');
	  next();
	},
	getParent(next) {
	  this
	  	.populate('parent', 'code');
	  next();
	}
}

// Scene.schema.pre('findOne', POPULATORS.getSelf);
// Scene.schema.pre('find', POPULATORS.getParent);

// Scene.schema.path('sceneLinks').schema.path('position').validate(validators.VEC_3);
// Scene.schema.path('sceneLinks').schema.path('rotation').validate(validators.VEC_3);

/**
 * Registration
 */
Scene.defaultColumns = 'name, parent, code|10%';
Scene.register();