const keystone = require('keystone');
const Scene = keystone.list('Scene');

exports.applySchemaUpdates = function (callback) {

	Scene.model.find().snapshot().exec((err, docs) => {
		docs.forEach(doc => {
			const oldProp = (doc.panorama || doc.image) || false;
			if (oldProp.url) {
				Scene.model.findOneAndUpdate(
					{ _id: doc._id },
					{ $set: { 'sky.panorama': oldProp }, $unset: { panorama: 1, image: 1 } }
				).exec((err, item) => callback(item));
			}
		});
	});

};
