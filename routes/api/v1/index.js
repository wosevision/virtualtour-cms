const middleware = require('../../middleware');
const router = require('express').Router();
const keystone = require('keystone');

exports.init = api => {
  const API_DEFAULTS = {
	  ALL: { 
	  	envelop: false,
	  	methods: 'list create update remove',
	  	populate: 'default',
	  	show: 'name label code parent default panorama'
	  },
	  GET: { 
	  	envelop: false,
	  	methods: 'retrieve',
	  	populate: 'default parent'
	  },
	  GEO: { 
	  	envelop: false,
	  	methods: 'retrieve list create update remove',
	  	populate: 'properties.link geometry geometries geometry.geometries'
	  }
	}

	// init REST API middleware
	api.expose({
    Location: API_DEFAULTS.ALL,
    Building: API_DEFAULTS.ALL,
    Scene: API_DEFAULTS.ALL
  })
	.expose({
    Location: API_DEFAULTS.GET,
    Building: API_DEFAULTS.GET,
    Scene: API_DEFAULTS.GET
  })
	.expose({
    Entity: { envelop: false },
    Category: { envelop: false },
    Geometry: API_DEFAULTS.GEO,
    Feature: API_DEFAULTS.GEO,
    FeatureCollection: { envelop: false }
  })
  .expose({
  	Draft: {
	  	envelop: false,
	  	methods: 'retrieve list create update remove',
	  	// populate: 'original'
  	}
  })
  .after('list', {
  	Feature: middleware.featureCollection,
  	FeatureCollection: middleware.sorterWare,
    Location: middleware.sorterWare,
    Building: middleware.sorterWare,
    Scene: middleware.sorterWare
	})
	.after('retrieve', {
		FeatureCollection: middleware.featureCollection
	})
	.start();
}

exports.router = routes => {
	router.all('*', keystone.middleware.api);
	// router.all('/scenes/:code', middleware.findByCode);
	router.use('/scenes', routes.scenes.router(routes));
	router.get('/', routes.index.handler);
	return router;
}

exports.handler = (req, res) => {
  //friendly 'got here' message with version
  res.apiResponse({
  	'name': 'UOIT Virtual Tour API',
  	'id': 'uoit-virtualtour',
    'version': 0.1
  });
};