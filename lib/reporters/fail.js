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
    this.stream = null;
    this.fails = [];
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
 *
 *
 * @param file
 * @param encoding
 * @param callback
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
 *
 */
FailReporter.prototype.flush = function()
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
