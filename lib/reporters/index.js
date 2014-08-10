'use strict';

var reporters, reporterFactory;

reporters = {
    console: require('./console'),
    fail: require('./fail'),
    jshint: require('./jshint')
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

module.exports = reporterFactory;
