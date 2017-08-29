const keystone = require('keystone');
const contentHashFilename = require('keystone-storage-namefunctions').contentHashFilename;

function getStorageAdapter (path, publicPath, adapter) {
	return new keystone.Storage({
		adapter: keystone.Storage.Adapters.FS,
		fs: {
			path: keystone.expandPath(path),
			publicPath,
			generateFilename: contentHashFilename,
			whenExists: 'overwrite',
		},
		schema: {
			size: true,
			mimetype: false,
			path: false,
			originalname: true,
			url: true,
		},
	});
}

exports.getStorageAdapter = getStorageAdapter;
