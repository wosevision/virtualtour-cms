const { singularize, pluralize, capitalize } = require('./string');
const { isImageSupported, supportsWebP } = require('./supports');

exports.singularize = singularize;
exports.pluralize = pluralize;
exports.capitalize = capitalize;
exports.isImageSupported = isImageSupported;
exports.supportsWebP = supportsWebP;

exports.log = require('./log');
