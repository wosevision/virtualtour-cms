const keystone = require('keystone'),
			router = require('express').Router(),
			middleware = require('../../middleware');

exports.router = routes => {
	router.param('code', middleware.findByCode('Scene'));
	router.param('parent', middleware.findByCode('Building'));
	router.get('/code/:code', (req, res) => {
		res.apiResponse(req['Scene'])
	});
	router.get('/parent/:parent', (req, res) => {
		const List = keystone.list('Scene');
		List.model.find({ parent: req['Building']._id }, function(err, data) {
			if (err) return res.apiError('LookupError', err, `Lookup "Scene" by "parent" failed`);
			if (!data) return res.apiNotFound();
			res.apiResponse(data);
		});
	});
	router.get('/:id/preload', (req, res) => {

		const List = keystone.list('Scene'),
					sceneId = req.params.id || req.query.id || req.body.id;

		List.model.findById(sceneId, 'sceneLinks.scene', (err, data) => {
			if (err) return res.apiError('LookupError', err, `Preload lookup for scene ${sceneId} failed`);
			if (!data) return res.apiNotFound();
			if (data.sceneLinks) {
				const promises = data.sceneLinks.map(
					link => new Promise((resolve, reject) => {
						List.model.findById(link.scene, 'panorama.public_id panorama.version', (err, data) => {
							if (err) return reject(err);
							resolve([ data.panorama.version, data.panorama.public_id].join('/'));
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
}