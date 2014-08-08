'use strict';

var PluginError = require('gulp-util').PluginError,
    errorFactory;

/**
 * @param {String} namespace
 * @returns {PluginError}
 */
errorFactory = function(namespace)
{
    return function(message) {
        return new PluginError(namespace, message);
    };
};

module.exports = errorFactory;
