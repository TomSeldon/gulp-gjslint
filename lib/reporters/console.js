'use strict';

var ConsoleReporter;

var merge = require('merge'),
    through = require('through2'),
    chalk = require('chalk'),
    errorFactory = require('../util/error-factory');

/**
 * @param options
 * @constructor
 */
ConsoleReporter = function(options)
{
    /**
     * @type {boolean}
     */
    this.failed = false;

    /**
     * @type {*}
     */
    this.options = merge({}, ConsoleReporter.DEFAULT_OPTIONS, options);

    /**
     * @type {*}
     */
    this.stream = null;
};

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
 * @returns {Array}
 */
ConsoleReporter.createErrorOutput = function(file)
{
    var output, results;

    output = [];
    results = file.gjslint.results;

    for (var i = 0, n = results.errors.length; i < n; i++) {
        var error, line, description;

        error = results.errors[i];
        line = chalk.gray('line ' + error.line);
        description = chalk.blue(error.description);

        output.push('  ' + line + ': ' + description);
    }

    output.push(chalk.bold.yellow('  Total errors in file: ' + results.total + '\n'));

    return output;
};

/**
 * @type {function}
 */
ConsoleReporter.prototype.createError = errorFactory('gulp-gjslint');

/**
 * @param {File} file
 * @param {string} encoding
 * @param {Function} callback
 */
ConsoleReporter.prototype.processFile = function(file, encoding, callback)
{
    var options, errorOutput;

    // Get copy of options so any changes are
    // restricted to this file.
    options = merge({}, this.options);

    if (file.gjslint && file.gjslint.success === false) {
        this.failed = true;

        errorOutput = ConsoleReporter.createErrorOutput(file);

        console.log(chalk.bold.white(file.path));

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
 * @returns {null|*}
 */
ConsoleReporter.prototype.run = function()
{
    this.stream = through.obj(this.processFile.bind(this), this.flush.bind(this));

    return this.stream;
};

module.exports = ConsoleReporter;
