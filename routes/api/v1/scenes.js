const keystone = require('keystone');
const router = require('express').Router();
const middleware = require('../../middleware');

exports.router = routes => {
	const List = keystone.list('Scene');

	router.param('code', middleware.findByCode('Scene'));
	router.param('parent', middleware.findByCode('Building'));

	// router.get('/test/fun', (req, res, next) => {
	// 	const paths = List.schema.paths;
	// 	const pathMap = Object.keys(paths).map(path => {
	// 		const output = { name: path };
	// 		Object.keys(paths[path]).map(key => {
	// 			console.log(paths[path][key]);
	// 			const { path: name, instance: type, options } = paths[path][key];
	// 			Object.assign(output, { name, type, options });
	// 		});
	// 		return output;
	// 	});
	// 	res.apiResponse(pathMap)
	// });

	router.get('/code/:code', (req, res) => {
		res.apiResponse(req['Scene']);
	});

	router.get('/parent/:parent', (req, res) => {
		List.model.find({ parent: req['Building']._id }, function (err, data) {
			if (err) return res.apiError('LookupError', err, `Lookup "Scene" by "parent" failed`);
			if (!data) return res.apiNotFound();
			res.apiResponse(data);
		});
	});

	router.get('/:id/preload', (req, res) => {
		const sceneId = req.params.id || req.query.id || req.body.id;

		List.model.findById(sceneId, 'sceneLinks.scene', (err, data) => {
			if (err) return res.apiError('LookupError', err, `Preload lookup for scene ${sceneId} failed`);
			if (!data) return res.apiNotFound();
			if (data.sceneLinks) {
				const promises = data.sceneLinks.map(
					link => new Promise((resolve, reject) => {
						List.model.findById(link.scene, 'image', (err, data) => {
							if (err) return reject(err);
							resolve(data.image);
						});
					})
				);
				Promise.all(promises)
					.then(data => res.apiResponse(data))
					.catch(err => res.apiError('PromiseError', err, `Scene ${sceneId} preloading promise rejected`));
			} else {
				res.apiResponse([]);
			}
		});
	});
	return router;
};
