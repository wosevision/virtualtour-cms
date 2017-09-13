const keystone = require('keystone');
const Types = keystone.Field.Types;

const { getStorageAdapter } = require('../utils');

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
			type: Types.Text,
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
		image: {
			type: Types.File,
			label: 'Panorama',
			initial: true,
			storage: getStorageAdapter('./uploads', '/api/v1/panoramas/'),
		},
	},
	'Sky configuration',
	{
		sky: {
			type: {
				type: Types.Select,
				label: 'Sky type',
				options: 'panorama, video, environment',
				default: 'panorama',
				initial: true,
			},
			panorama: {
				dependsOn: { 'sky.type': 'panorama' },
				type: Types.File,
				label: 'Panorama',
				note: 'Select an equirectangular panorama to upload for the sky background. Panorama widths must be twice their height, and perform best in powers of two (optimal: 4096x2048).',
				initial: true,
				storage: getStorageAdapter('./uploads', '/api/v1/panoramas/'),
			},
			video: {
				dependsOn: { 'sky.type': 'video' },
				type: Types.Url,
				label: 'Video',
				note: 'Enter the URL of a 360° YouTube video to use as the sky background. WARNING: use of a video you do not own is a violation of the YouTube terms of service.',
				initial: true,
			},
			environment: {
				color: {
					dependsOn: { 'sky.type': 'environment' },
					type: Types.Color,
					label: 'Sky colour',
					note: 'Pick a colour to use as the sky background.',
					initial: true,
				},
				fog: {
					enabled: {
						dependsOn: { 'sky.type': 'environment' },
						type: Types.Boolean,
						label: 'Fog',
						initial: true,
					},
					color: {
						dependsOn: { 'sky.type': 'environment', 'sky.environment.fog.enabled': true },
						type: Types.Color,
						label: 'Fog colour',
						initial: true,
					},
				},
			},
		},
	},
	'Scene configuration',
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
				label: {
					type: Types.Select,
					note: 'Provides a text popup for the scene link. Default: automatically show popups on scenes that link to scenes from other groups (such as a different building).',
					options: 'default, scene, building, custom',
					default: 'default',
				},
				custom: {
					type: Types.Text,
					label: 'Custom label',
					dependsOn: { label: 'custom' },
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
				thumbnail: {
					type: Types.File,
					label: 'Thumbnail image',
					storage: getStorageAdapter('./uploads/static', '/api/v1/static/'),
				},
				position: {
					type: Types.NumberArray,
				},
			},
			note: 'Provide info on special points; can be edited within tour for proper postioning',
		},
	},
	'Advanced configuration',
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

Scene.schema.statics.findByCode = function (code, cb) {
	return this.findOne({ code: code }, cb);
};

Scene.schema.index({ parent: 1, code: 1 });

/**
 * Registration
 */
Scene.track = true;
Scene.defaultColumns = 'name, parent, image, code|10%, state';
Scene.register();
