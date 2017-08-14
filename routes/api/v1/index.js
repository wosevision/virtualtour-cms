const keystone = require('keystone');
const router = require('express').Router();
const middleware = require('../../middleware');

exports.init = app => {
	const DEFAULTS = {
		ALL: {
			envelop: false,
			methods: 'list create update remove',
			show: 'name label code parent default',
		},
		GET: {
			envelop: false,
			methods: 'retrieve',
			populate: 'default parent',
		},
		GEO: {
			envelop: false,
			methods: 'retrieve list create update remove',
			populate: 'properties.link geometry geometries geometry.geometries',
		},
		SCENE_GET: {
			envelop: false,
			methods: 'retrieve create update',
			populate: 'default parent entities',
			show: 'name code parent image sceneLinks hotSpots entities',
		},
		SCENE_ALL: {
			envelop: false,
			methods: 'list remove',
			populate: 'default entities',
			show: 'name code parent image sceneLinks hotSpots entities',
		},
	};

	// init REST API middleware
	app.expose({
		Location: DEFAULTS.ALL,
		Building: DEFAULTS.ALL,
		Scene: DEFAULTS.SCENE_ALL,
	})
	.expose({
		Location: DEFAULTS.GET,
		Building: DEFAULTS.GET,
		Scene: DEFAULTS.SCENE_GET,
	})
	.expose({
		Entity: { envelop: false },
		Category: { envelop: false },
		Geometry: DEFAULTS.GEO,
		Feature: DEFAULTS.GEO,
		FeatureCollection: { envelop: false },
	})
	.expose({
		Draft: {
			envelop: false,
			methods: 'list',
			show: 'original owner updatedAt',
		},
	})
	.expose({
		Draft: {
			envelop: false,
			methods: 'retrieve create update remove',
			show: 'content original owner kind updatedAt',
		},
	})
	.before('list', {
		Draft: middleware.filterByOwner,
	})
	.before('create update', {
		Draft: middleware.attachOwner,
	})
	.after('list', {
		Feature: middleware.featureCollection,
		FeatureCollection: middleware.sorterWare,
		Location: middleware.sorterWare,
		Building: middleware.sorterWare,
		Scene: middleware.sorterWare,
		Draft: middleware.sorterWare,
	})
	.after('retrieve', {
		FeatureCollection: middleware.featureCollection,
		Feature: middleware.featureCollection,
		Scene: middleware.scenePopulate,
	})
	.start();
};

exports.router = routes => {
	router.all('*', keystone.middleware.api);
	router.use('/search', routes.search.router(routes));
	// router.all('/scenes/:code', middleware.findByCode);
	router.use('/scenes', routes.scenes.router(routes));
	router.use('/panoramas', routes.panoramas.router(routes));
	router.get('/', routes.index.handler);
	return router;
};

exports.handler = (req, res) => {
	// friendly 'got here' message with version
	res.apiResponse({
		name: 'UOIT Virtual Tour API',
		id: 'uoit-virtualtour',
		version: 0.1,
	});
};
