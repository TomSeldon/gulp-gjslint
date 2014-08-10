'use strict';

var through = require('through2'),
    JshintAdapter = require('../util/jshint-adapter');

var JshintReporter;

/**
 * @param reporter
 * @param options
 * @constructor
 */
JshintReporter = function(reporter, options)
{
    this.reporter = reporter;
    this.options = options || {};
    this.stream = null;
    this.buffer = [];
};

/**
 * @type {string}
 */
JshintReporter.REPORTER_NAME = 'jshint';

/**
 * @param file
 * @param encoding
 * @param callback
 */
JshintReporter.prototype.processFile = function(file, encoding, callback)
{
    file = new JshintAdapter(file);

    if (!file.jshint.success) {
        this.reporter(file.jshint.results, file.jshint.data, this.options);
    }

    this.buffer.push(file);
    callback();
};

/**
 *
 */
JshintReporter.prototype.flush = function()
{
    this.buffer.forEach(function(file) {
        this.stream.push(file);
    }, this);
};

/**
 * @returns {null|*}
 */
JshintReporter.prototype.run = function()
{
    this.stream = through.obj(this.processFile.bind(this), this.flush.bind(this));

    return this.stream;
};

module.exports = JshintReporter;
