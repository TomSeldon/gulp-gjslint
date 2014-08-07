/*
 * gulp-gjslint
 */

/* jshint global require */
/* jshint global module */
/* jshint global exports */

'use strict';

var GulpGjslint;

var gjslint = require('closure-linter-wrapper').gjslint,
    PluginError = require('gulp-util').PluginError,
    merge = require('merge' ),
    through = require('through2');

/**
 *
 * @param {*} options
 * @constructor
 */
GulpGjslint = function(options)
{
    // Set options to empty object if none were specified
    options = options || {};

    // Merge options with the default options
    this.options = merge(GulpGjslint.DEFAULT_OPTIONS, options);

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
 * @param {String} errorMsg
 * @returns {PluginError}
 */
GulpGjslint.prototype.createError = function(errorMsg)
{
    return new PluginError(GulpGjslint.PLUGIN_NAME, errorMsg);
};

/**
 * @param {Vinyl} file
 * @param {String} encoding
 * @param {Function} callback
 */
GulpGjslint.prototype.processFile = function(file, encoding, callback)
{
    if (file.isStream()) {
        this.stream.emit('error', this.createError('Streaming is not supported'));
        return callback();
    }

    this.options.src = [file.path];

    gjslint(this.options, function(err, data) {
        return this.gjslintCallback(err, data, file, callback);
    }.bind(this));
};

/**
 * @param {null|*} err
 * @param {*} data
 * @param {Vinyl} file
 * @param {Function} callback
 */
GulpGjslint.prototype.gjslintCallback = function(err, data, file, callback)
{
    if (err) {
        this.stream.emit('error', this.createError(err.description));
    }

    this.stream.push(file);
    callback();
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
