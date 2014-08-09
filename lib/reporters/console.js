'use strict';

var ConsoleReporter;

var merge = require('merge'),
    through = require('through2'),
    Table = require('cli-table'),
    errorFactory = require('../util/error-factory');

/**
 * @param options
 * @constructor
 */
ConsoleReporter = function(options)
{
    this.options = merge({}, ConsoleReporter.DEFAULT_OPTIONS, options);
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
    fail: false,

    table: {
        head: ['Line', 'Description']
    }
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
    var options, table;

    // Get copy of options so any changes are
    // restricted to this file.
    options = merge({}, this.options);

    table = new Table(options.table);

    if (file.gjslint && file.gjslint.success === false) {
        for (var i = 0, n = file.gjslint.errors.length; i < n; i++) {
            var error;

            error = file.gjslint.errors[i];

            table.push([error.line, error.description]);
        }

        if (table.length) {
            console.log(file.path);
            console.log(table.toString());
        }

        if (this.options.fail === true) {
            this.stream.emit('error', this.createError('Linting failed'));
        }
    }

    this.stream.push(file);
    callback();
};

/**
 * @returns {null|*}
 */
ConsoleReporter.prototype.run = function()
{
    this.stream = through.obj(this.processFile.bind(this));

    return this.stream;
};

module.exports = ConsoleReporter;
