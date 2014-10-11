'use strict';

var merge = require('merge');
var chalk = require('chalk');
var errorFactory = require('../util/error-factory');
var AbstractReporter = require('./abstract-reporter');

/**
 * @param {Object=} options
 * @extends {AbstractReporter}
 * @constructor
 */
var ConsoleReporter = function(options)
{
  /**
   * @type {boolean}
   */
  this.failed = false;

  /**
   * @type {*}
   */
  this.options = merge({}, ConsoleReporter.DEFAULT_OPTIONS, options);
};

/**
 * Inherit from AbstractReporter.
 *
 * @type {AbstractReporter}
 */
ConsoleReporter.prototype = new AbstractReporter();

/**
 * Correctly set the constructor, which will have been
 * set to AbstractReporter.
 *
 * @type {ConsoleReporter}
 */
ConsoleReporter.prototype.constructor = ConsoleReporter;

/**
 * @type {string}
 */
ConsoleReporter.REPORTER_NAME = 'console';

/**
 * @type {*}
 */
ConsoleReporter.DEFAULT_OPTIONS = {
  fail: false
};

/**
 * @param {File} file
 * @return {Array}
 */
ConsoleReporter.createErrorOutput = function(file)
{
  var output = [];
  var results = file.gjslint.results;

  for (var i = 0, n = results.errors.length; i < n; i += 1) {
    var error = results.errors[i];
    var line = chalk.gray('line ' + error.line);
    var description = chalk.blue(error.description);

    output.push('  ' + line + ': ' + description);
  }

  output.push(
    chalk.bold.yellow('  Total errors in file: ' + results.total + '\n')
  );

  return output;
};

/**
 * @type {function}
 */
ConsoleReporter.prototype.createError = errorFactory('gulp-gjslint');

/**
 * Output linting result to the console for a single file.
 *
 * TODO: Check why options aren't being used.
 *
 * @param {File} file
 * @param {string} encoding
 * @param {Function} callback
 */
ConsoleReporter.prototype.processFile = function(file, encoding, callback)
{
  var options = merge({}, this.options);
  var errorOutput;

  if (file.gjslint && file.gjslint.success === false) {
    this.failed = true;

    errorOutput = ConsoleReporter.createErrorOutput(file);

    console.log(chalk.bold.bgBlue.white(file.path));

    if (errorOutput.length) {
      errorOutput.forEach(function(e) {
        console.log(e);
      });
    }

    if (this.options.fail === true) {
      this.stream.emit('error', this.createError('Linting failed'));
    }
  }

  this.stream.push(file);

  callback();
};

/**
 * Output failure message after the errors have been shown.
 *
 * @param {function} callback
 */
ConsoleReporter.prototype.flush = function(callback)
{
  if (this.failed === true) {
    console.log(chalk.bold.red('gjslint failed'));
  }

  callback();
};

/**
 * @type {ConsoleReporter}
 */
module.exports = ConsoleReporter;
