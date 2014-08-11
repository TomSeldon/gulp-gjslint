/*
 * gulp-gjslint
 */

'use strict';

var GulpGjslint;

var gjslint = require('closure-linter-wrapper').gjslint,
    PluginError = require('gulp-util').PluginError,
    merge = require('merge'),
    through = require('through2'),
    errorFactory = require('./util/error-factory');

/**
 * @param {*} options
 * @constructor
 */
GulpGjslint = function(options)
{
    // Set options to empty object if none were specified
    options = options || {};

    // Merge options with the default options
    this.options = merge({}, GulpGjslint.DEFAULT_OPTIONS, options);

    // Force reporter to be null as reporting is handled separately
    this.options.reporter = GulpGjslint.DEFAULT_OPTIONS.reporter;

    // Initialise stream property
    this.stream = null;
};

/**
 * @type {string}
 */
GulpGjslint.PLUGIN_NAME = 'gulp-gjslint';

/**
 * @type {*}
 */
GulpGjslint.DEFAULT_OPTIONS = {
    reporter: null
};

/**
 * @type {*}
 */
GulpGjslint.reporter = require(__dirname + '/reporters');

/**
 * @param {String} errorMsg
 * @returns {PluginError}
 */
GulpGjslint.prototype.createError = new errorFactory(GulpGjslint.PLUGIN_NAME);

/**
 * Adds linting result data to a File object.
 *
 * This data can be used by a reporter after the stream
 * has finished.
 *
 * @param {File} file
 * @param {null|*} errors
 * @returns {File}
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
        // Store result data on the file object
        file = this.parseResults(file, err);

        this.stream.push(file);
        callback();
    }.bind(this));
};

/**
 *
 * @returns {null|*}
 */
GulpGjslint.prototype.run = function()
{
    this.stream = through.obj(this.processFile.bind(this));

    return this.stream;
};

module.exports = GulpGjslint;
