const {
  singularize,
  pluralize,
  capitalize
} = require('./string');
const {
  isImageSupported,
  supportsWebP
} = require('./supports');
const {
  getStorageAdapter
} = require('./storage');
const log = require('./log');

module.exports = {
  singularize,
  pluralize,
  capitalize,
  isImageSupported,
  supportsWebP,
  getStorageAdapter,
  log,
};
