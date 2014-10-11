'use strict';

var PluginError = require('gulp-util').PluginError;

/**
 * @param {String} namespace
 * @return {Function}
 */
var errorFactory = function(namespace)
{
  return function(message) {
    return new PluginError(namespace, message);
  };
};

/**
 * @type {errorFactory}
 */
module.exports = errorFactory;
