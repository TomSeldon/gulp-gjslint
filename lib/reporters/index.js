'use strict';

var reporters, reporterFactory;

reporters = {
    console: require('./console'),
    fail: require('./fail')
};

/**
 * Factory for returning new reporter object.
 *
 * @param {String} name
 * @param {*} [options]
 * @returns {Function}
 */
reporterFactory = function(name, options)
{
    options = options || {};

    var Reporter, reporter;

    Reporter = reporters[name];
    reporter = new Reporter(options);

    return reporter.run();
};

module.exports = reporterFactory;
