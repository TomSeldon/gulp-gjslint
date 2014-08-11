'use strict';

var through = require('through2'),
    errorFactory = require('../util/error-factory');

var FailReporter;

/**
 * Reporter to emit an error on finding the first linting error.
 *
 * Intended for use with CI servers so the build can be failed
 * appropriately when a linting error is found.
 *
 * @constructor
 */
FailReporter = function()
{
    /**
     * @type {*}
     */
    this.stream = null;

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
    var errorMsg;

    if (this.fails.length) {
        errorMsg = [];

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
 * @returns {null|*}
 */
FailReporter.prototype.run = function()
{
    this.stream = through.obj(this.processFile.bind(this), this.flush.bind(this));

    return this.stream;
};

module.exports = FailReporter;
