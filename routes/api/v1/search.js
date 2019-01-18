const keystone = require('keystone');
const router = require('express').Router();
const async = require('async');
const {
  singularize,
  capitalize
} = require('../../../utils');

exports.router = routes => {
  router.get('/', (req, res) => {
    // if (req.query.q) {
    console.log('Search query: ', req.query.q);
    /**
     * `collections` and `fields` hold the parsed values of
     * req.query which are arrays of useful strings.
     * The default is set to an array of all possible
     * values if no query values are provided.
     * @type [{String}]
     */
    const collections = req.query.filter ? req.query.filter.split(',') : ['scenes', 'buildings'];
    const fields = req.query.fields ? req.query.fields.split(',') : ['name', 'desc', 'code'];
    const results = {};
    const overview = [];
    let count = 0;

    /**
     * Maps the fields array generated from req.query.fields
     * @param  {String} field Name of field to query
     * @return {Object}       Options object for db query
     */
    const queryFilter = req.query.q ?
      {
        $or: fields.map(field => {
          let fieldFilter = {};
          fieldFilter[field] = {
            $regex: new RegExp(req.query.q),
            $options: 'i',
          };
          return fieldFilter;
        }),
      } : {};

    /**
     * Maps the collections array generated from req.query.filter
     * into a querySeries array of async functions
     * @param  {Function} collection Incoming collection name in map
     * @return {Function}            Call next function in series
     */
    const querySeries = collections.map(collection => next => {
      // format the incoming collection names
      const collectionSingular = singularize(collection.toLowerCase());
      const modelName = capitalize(collectionSingular);
      // perfrom $or query based on array supplied by fieldList
      keystone.list(modelName).model
        .find(queryFilter, 'parent name label code desc')
        // .populate('parent', 'parent name label code')
        .populate({
          path: 'parent',
          select: 'parent name label code',
          populate: {
            path: 'parent',
            select: 'name label code',
          },
        })
        .exec((err, output) => {
          if (err) console.log('Query error');
          if (output.length > 0) {
            results[collectionSingular] = [...output];
            const overviewItems = [...output].map(item => item.name);
            overview.push(...overviewItems);
            count = count + overviewItems.length;
          }
          return next(err);
        });
    });
    // const queryCollection = (collection, callback) => {
    // 	// format the incoming collection names
    // 	const collectionSingular = singularize(collection.toLowerCase());
    // 	const modelName = capitalize(collectionSingular);
    // 	console.log(modelName);
    // 	// perfrom $or query based on array supplied by fieldList
    // 	return keystone.list(modelName).model.find({
    // 		$or: fieldList
    // 	}).exec((err, output) => {
    // 	  if (err) return callback(err);
    // 	  if (output.length > 0) return callback(null, ...output);
    // 	});
    // };

    /**
     * Run async series of functions provided from querySeries
     * @param  {Object} err Error response
     * @return {Object}     API response
     */
    async.parallel(querySeries, err => {
      if (err) return res.apiError(err);
      return res.apiResponse({
        count,
        overview,
        results
      });
    });
    // async.map(collections, queryCollection, (err, results) => {
    //   if (err) return res.apiError(err);
    //   return res.apiResponse(results);
    // });

    // } else {
    // 	return res.apiResponse({
    //    	message: 'Please enter a search query',
    //    	success: false
    //    });
    // }
  });
  return router;
};
