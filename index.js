/*
 * gulp-gjslint
 */

'use strict';

var GulpGjslint = require(__dirname + '/lib/GulpGjslint');
var task;

/**
 * @param {Object=} options
 * @returns {null|*}
 */
task = function(options)
{
  var gulpGjslint = new GulpGjslint(options);

  return gulpGjslint.run();
};

/**
 * @type {Function}
 */
module.exports = task;

/**
 * @type {*}
 */
module.exports.reporter = GulpGjslint.reporter;
