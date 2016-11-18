const keystone = require('keystone');
const Types = keystone.Field.Types;

const storageAdapter = new keystone.Storage({
  adapter: keystone.Storage.Adapters.FS,
  fs: {
    path: keystone.expandPath('./panoramas'),
    publicPath: '/panoramas',
  },
});

/**
 * User Model
 * ==========
 */
var Panorama = new keystone.List('Panorama', {
    map: { name: 'code' },
    drilldown: 'building'
});//,
    // Building = keystone.list('Building'),
    // Scene = keystone.list('Scene');

Panorama.add({
	code: {
		type: Types.Text,
		index: true,
		noedit: true,
		watch: 'building scene',
		value: function () {
			return [this.building, this.scene].join('_');
		}
	},
  file: {
  	type: Types.File,
  	storage: storageAdapter,
		filename: function(item, file){
			return [item.building, item.scene].join('_') + '.' + file.extension
		}
	}
}, 'References', {
	building: {
		type: Types.Relationship,
		initial: true,
		ref: 'Building'
	},
	scene: {
		type: Types.Relationship,
		initial: true,
		ref: 'Scene',
		filters: { parent: ':building' }
	}
});

/**
 * Registration
 */
Panorama.track = true;
Panorama.defaultColumns = 'code, building, scene';
Panorama.register();