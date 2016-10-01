/**
 * This file contains the common middleware used by models
 *
 */
var _ = require('lodash');

//
const VEC_3 = '{PATH} {VALUE} does not match required format: 0 0 0';

/**
*/
exports.VEC_3 = {
	validator: function(v) {
  	return /([-+]?[0-9]*\.?[0-9]+ ){1}([-+]?[0-9]*\.?[0-9]+ ){1}([-+]?[0-9]*\.?[0-9]+){1}/.test(v);
	},
	msg: VEC_3
}

