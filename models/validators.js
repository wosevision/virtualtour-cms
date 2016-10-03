/**
 * This file contains the common middleware used by models
 *
 */

/**
*/
exports.VEC_3 = function(v) {
	return /([-+]?[0-9]*\.?[0-9]+ ){1}([-+]?[0-9]*\.?[0-9]+ ){1}([-+]?[0-9]*\.?[0-9]+){1}/.test(v);
}

exports.LIMIT_VEC3 = function(V) {
  return V.length <= 3;
}

