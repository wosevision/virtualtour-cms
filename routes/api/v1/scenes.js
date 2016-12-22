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
	   	if (err) {
	      return res.apiError('LookupError', err, `Lookup "Scene" by "parent" failed`);
	   	}
	   	if (!data) {
	      return res.apiNotFound();
	   	}
			res.apiResponse(data);
	  });
	});
	return router;
}