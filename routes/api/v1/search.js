const keystone = require('keystone');
const router = require('express').Router();
const async = require('async');
const utils = require('../../../utils/string');

exports.router = routes => {
	router.get('/', (req, res) => {
		if (req.query.q) {
			/**
			 * Parse req.query values into arrays of useful strings
			 * @type [{String}]
			 */
			const collections = req.query.filter ? req.query.filter.split(',') : ['scenes', 'buildings'];
			const fields = req.query.fields ? req.query.fields.split(',') : ['name', 'desc'];
			const results = {};

			/**
			 * Maps the fields array generated from req.query.fields
			 * @param  {String} field Name of field to query
			 * @return {Object}       Options object for db query
			 */
			const fieldList = fields.map(field => {
				let fieldFilter = {};
				fieldFilter[field] = {
					$regex: new RegExp(req.query.q),
					$options: 'i'
				};
				return fieldFilter;
			});

			/**
			 * Maps the collections array generated from req.query.filter
			 * into a querySeries array of async functions
			 * @param  {Function} collection Incoming collection name in map
			 * @return {Function}            Call next function in series
			 */
			const querySeries = collections.map(collection => next => {
				// format the incoming collection names
				const collectionSingular = utils.singularize(collection.toLowerCase());
				const modelName = utils.capitalize(collectionSingular);
				// perfrom $or query based on array supplied by fieldList
				keystone.list(modelName).model.find({
					$or: fieldList
				}, (err, output) => {
				  if (err) console.log('Query error');
				  if (output.length > 0) results[collection] = [...output];
				  return next(err);
				});
			});

			/**
			 * Run async series of functions provided from querySeries
			 * @param  {Object} err Error response
			 * @return {Object}     API response
			 */
			async.series(querySeries, err => {
			  if (err) return res.apiError(err);
			  return res.apiResponse(results);
			});
		} else {
			return res.apiResponse({
	    	message: 'Please enter a search query',
	    	success: false
	    });
		}
	});
	return router;
}