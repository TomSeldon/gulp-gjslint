'use strict';

var reporters, reporterFactory;

reporters = {
    console: require('./console-reporter'),
    fail: require('./fail-reporter'),
    jshint: require('./jshint-reporter')
};

/**
 * Factory for returning new reporter object.
 *
 * @param {String} name
 * @returns {Function}
 */
reporterFactory = function(name)
{
    var Reporter, reporter, args;

    args = Array.prototype.slice.call(arguments);

    Reporter = reporters[name].bind.apply(reporters[name], args);
    reporter = new Reporter();

    return reporter.run();
};

/**
 * @type {reporterFactory}
 */
module.exports = reporterFactory;
