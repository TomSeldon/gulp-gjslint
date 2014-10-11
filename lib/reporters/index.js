'use strict';

var reporters = {
  console: require('./console-reporter'),
  fail: require('./fail-reporter'),
  jshint: require('./jshint-reporter')
};

/**
 * Factory for returning new reporter object.
 *
 * @param {String} name
 * @return {Function}
 */
function reporterFactory(name)
{
  var args = Array.prototype.slice.call(arguments);
  var Reporter = reporters[name].bind.apply(reporters[name], args);
  var reporter = new Reporter();

  return reporter.run();
}

/**
 * @type {reporterFactory}
 */
module.exports = reporterFactory;
