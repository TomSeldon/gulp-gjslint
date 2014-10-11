'use strict';

var errorFactory = require('../util/error-factory');
var AbstractReporter = require('./abstract-reporter');

/**
 * Reporter to emit an error on finding the first linting error.
 *
 * Intended for use with CI servers so the build can be failed
 * appropriately when a linting error is found.
 *
 * @extends {AbstractReporter}
 * @constructor
 */
var FailReporter = function()
{
  /**
   * @type {Array}
   */
  this.fails = [];

  /**
   * @type {Array}
   */
  this.buffer = [];
};

/**
 * Inherit from AbstractReporter.
 *
 * @type {AbstractReporter}
 */
FailReporter.prototype = new AbstractReporter();

/**
 * Reset constructor to FailReporter.
 *
 * @type {FailReporter}
 */
FailReporter.prototype.constructor = FailReporter;

/**
 * @type {string}
 */
FailReporter.REPORTER_NAME = 'fail';

/**
 * @type {function}
 */
FailReporter.prototype.createError = errorFactory('gulp-gjslint');

/**
 * @param {File} file
 * @param {string} encoding
 * @param {function} callback
 */
FailReporter.prototype.processFile = function(file, encoding, callback)
{
  if (file.gjslint && file.gjslint.success === false) {
    this.fails.push(file.path);
  }

  this.buffer.push(file);

  callback();
};

/**
 * Emit an error if there were any failures.
 *
 * @param {function} callback
 */
FailReporter.prototype.flush = function(callback)
{
  var errorMsg = [];

  if (this.fails.length) {
    errorMsg.push('Linting failed for files: ');
    errorMsg.push(this.fails.join(', '));

    this.stream.emit('error', this.createError(errorMsg.join('')));
  }

  this.buffer.forEach(function(file) {
    this.stream.push(file);
  }, this);

  callback();
};

/**
 * @type {FailReporter}
 */
module.exports = FailReporter;
