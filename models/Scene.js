const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Scene model
 * ==========
 */
const Scene = new keystone.List('Scene', {
  // autokey: { path: 'code', from: 'name', unique: true },
	defaultSort: 'parent name code',
	drilldown: 'parent',
});

Scene.add(
	'Metadata',
	{
		name: {
			type: String,
			initial: true,
			index: true,
			required: true,
		},
		code: {
			type: Types.Key,
			note: 'Used for unique identification (such as in URLs). No special characters.',
			separator: '_',
			width: 'small',
			initial: true,
			required: true,
			index: true,
			lowercase: true,
		},
		state: {
			type: Types.Select,
			options: 'draft, published, archived',
			default: 'published',
			index: true,
		},
		parent: {
			type: Types.Relationship,
			label: 'Building',
			ref: 'Building',
			initial: true,
			index: true,
		},
		panorama: {
			type: Types.CloudinaryImage,
			initial: true,
			autoCleanup: true,
			select: true,
			selectPrefix: 'scenes/panorama',
			format: 'auto',
		},
	},
	'Tour data',
	{
		sceneLinks: {
			type: Types.List,
			fields: {
				scene: {
					type: Types.Relationship,
					ref: 'Scene',
				},
				position: {
					type: Types.NumberArray,
					default: [0, 0, 0],
				},
				rotation: {
					type: Types.NumberArray,
					default: [0, 0, 70],
				},
			},
			note: 'Provide links to other scenes; can be edited within tour for proper rotation and postioning',
		},
		hotSpots: {
			type: Types.List,
			fields: {
				linked: {
					type: Types.Boolean,
					label: 'Link to a campus map feature?',
					default: false,
				},
				feature: {
					type: Types.Relationship,
					label: 'Feature link',
					ref: 'Feature',
					dependsOn: { linked: true },
				},
				name: {
					type: Types.Text,
					dependsOn: { linked: false },
				},
				desc: {
					type: Types.Html,
					wysiwyg: true,
					dependsOn: { linked: false },
				},
				position: {
					type: Types.NumberArray,
				},
			},
			note: 'Provide info on special points; can be edited within tour for proper postioning',
		},
	},
	'Advanced',
	{
		assets: {
			type: Types.Relationship,
			ref: 'Entity',
			many: true,
		},
		entities: {
			type: Types.Relationship,
			ref: 'Entity',
			many: true,
		},
		script: {
			type: Types.Code,
			label: 'Javascript',
			language: 'js',
		},
	}
);

/**
 * Emergency schema edit for #nested-lists branch maintenance
 * Comment props out on List, uncomment props on schema when branch is broken
 */
// Scene.schema.add({
// 	sceneLinks: [{ scene: String, position: [ Number ], rotation: [ Number ] }],
// 	hotSpots: [{ linked: Boolean, feature: String, name: String, desc: String, position: [ Number ] }]
// });

Scene.schema.statics.findByCode = function (code, cb) {
	return this.findOne({ code: code }, cb);
};

Scene.schema.index({ parent: 1, code: 1 });

/**
 * Registration
 */
Scene.track = true;
Scene.defaultColumns = 'name, parent, panorama, code|10%, state';
Scene.register();
