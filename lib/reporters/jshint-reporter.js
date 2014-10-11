'use strict';

var JshintAdapter = require('../util/jshint-adapter');
var AbstractReporter = require('./abstract-reporter');

/**
 * @param {Function} reporter
 * @param {Object=} options
 * @extends {AbstractReporter}
 * @constructor
 */
var JshintReporter = function(reporter, options)
{
  /**
   * @type {Function}
   * @private
   */
  this.reporter_ = reporter;

  /**
   * @type {JshintAdapter}
   * @private
   */
  this.adapter_ = JshintAdapter;

  /**
   * @type {Object|{}}
   * @private
   */
  this.options_ = options || {};

  /**
   * @type {Array}
   * @private
   */
  this.buffer_ = [];
};

/**
 * Inherit from AbstractController.
 *
 * @type {AbstractReporter}
 */
JshintReporter.prototype = new AbstractReporter();

/**
 * Reset constructor.
 *
 * @type {JshintAdapter}
 */
JshintReporter.prototype.constructor = JshintReporter;

/**
 * @type {string}
 */
JshintReporter.REPORTER_NAME = 'jshint';

/**
 * @param {File} file
 * @param {String} encoding
 * @param {Function} callback
 */
JshintReporter.prototype.processFile = function(file, encoding, callback)
{
  file = this.adapter_.parseFile(file);

  if (!file.jshint.success) {
    this.reporter_(
      file.jshint.results,
      file.jshint.data,
      this.options_
    );
  }

  this.buffer_.push(file);

  callback();
};

/**
 * Called after all files have been processed.
 */
JshintReporter.prototype.flush = function()
{
  this.buffer_.forEach(function(file) {
    this.stream.push(file);
  }, this);
};

/**
 * @type {JshintReporter}
 */
module.exports = JshintReporter;
