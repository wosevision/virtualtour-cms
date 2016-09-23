var keystone = require('keystone');
var Types = keystone.Field.Types;

// var storageAdapter = new keystone.Storage({
//   adapter: keystone.Storage.Adapters.FS,
//   fs: {
//     path: keystone.expandPath('../virtualtour/panoramas'),
//     publicPath: '/api/panoramas',
//   },
// });

/**
 * User Model
 * ==========
 */
var Scene = new keystone.List('Scene', {
    autokey: { path: 'code', from: 'name', unique: true },
    defaultSort: '-bldgRef',
    drilldown: 'bldgRef'
});

Scene.add({
	name: {
		type: Types.Text,
		initial: true,
		index: true,
	},
	code: {
		type: Types.Text,
		initial: true,
		required: true,
		unique: true,
		index: true
	},
	// pano: {
	// 	type: Types.File,
	// 	label: 'Panorama',
	// 	storage: storageAdapter
	// },
	// building: {
	// 	type: Types.Text
	// },
	bldgRef: {
		type: Types.Relationship,
		label: 'Building',
		ref: 'Building'
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
Scene.defaultColumns = 'name, bldgRef, code|10%';
Scene.register();