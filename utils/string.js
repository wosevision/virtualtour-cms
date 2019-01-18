const _p = require('pluralize');

exports.singularize = _p.singular;
exports.pluralize = _p.plural;

exports.capitalize = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
