/*
 * gulp-gjslint
 */

'use strict';

var GulpGjslint;
var gjslint = require('closure-linter-wrapper').gjslint;
var PluginError = require('gulp-util').PluginError;
var merge = require('merge');
var through = require('through2');
var errorFactory = require('./util/error-factory');

/**
 * @param {Object=} options
 * @constructor
 */
GulpGjslint = function(options)
{
  // Set options to empty object if none were specified
  options = options || {};

  /**
   * Merge options with the default options.
   *
   * @type {*|exports}
   */
  this.options = merge({}, GulpGjslint.DEFAULT_OPTIONS, options);

  // Force reporter to be null as reporting is handled separately
  this.options.reporter = GulpGjslint.DEFAULT_OPTIONS.reporter;

  /**
   * Initialise stream property.
   *
   * @type {null}
   */
  this.stream = null;

  /**
   * @type {Function}
   */
  this.createError = new errorFactory(GulpGjslint.PLUGIN_NAME);
};

/**
 * @type {string}
 */
GulpGjslint.PLUGIN_NAME = 'gulp-gjslint';

/**
 * @type {Object}
 */
GulpGjslint.DEFAULT_OPTIONS = {
  reporter: null
};

/**
 * @type {*}
 */
GulpGjslint.reporter = require(__dirname + '/reporters');

/**
 * Adds linting result data to a File object.
 *
 * This data can be used by a reporter after the stream
 * has finished.
 *
 * @param {File} file
 * @param {Object=} errors
 * @return {File}
 */
GulpGjslint.prototype.parseResults = function(file, errors)
{
  file.gjslint = {
    success: !errors
  };

  if (errors) {
    file.gjslint.results = errors.info;

    // gjslint returns an array of files,
    // but we only processed one, so just
    // return that one.
    file.gjslint.results.errors = file.gjslint.results.fails[0].errors;
    delete file.gjslint.results.fails;
  }

  return file;
};

/**
 * @param {File} file
 * @param {String} encoding
 * @param {Function} callback
 * @return {Function=}
 */
GulpGjslint.prototype.processFile = function(file, encoding, callback)
{
  // Get copy of options, so that any modifications
  // will be for this file only.
  var options = merge({}, this.options);

  if (file.isStream()) {
    this.stream.emit(
      'error',
      this.createError('Streaming is not supported')
    );

    return callback();
  }

  options.src = [file.path];

  gjslint(options, function(err) {
    // Check gjslint didn't blow up
    if (err && (err.code !== 0 && err.code !== 2)) {
      /*
       Exit codes:
       0: Linting success
       1: Python not found
       2: Linting failed
       3: Parsing failed
       4: gjslint exception
       */

      var errorMessage;

      errorMessage = 'gjslint crashed whilst parsing: ' + file.path +
       '\nReason: ' + err.description +
        '\n\n' + err.info;

      this.stream.emit('error', this.createError(errorMessage));
    }

    // Store result data on the file object
    file = this.parseResults(file, err);

    this.stream.push(file);

    callback();
  }.bind(this));

  return null;
};

/**
 * @return {Stream=}
 */
GulpGjslint.prototype.run = function()
{
  this.stream = through.obj(this.processFile.bind(this));

  return this.stream;
};

/**
 * @type {GulpGjslint}
 */
module.exports = GulpGjslint;
