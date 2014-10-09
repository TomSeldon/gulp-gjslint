'use strict';

var through = require('through2');

/**
 * Base reporter than should be extended by concrete reporters.
 *
 * @constructor
 */
var AbstractReporter = function()
{
  /**
   * @type {null}
   */
  this.stream = null;
};

/**
 * Error message should an abstract method not be implemented
 * by a sub-class.
 *
 * @type {string}
 */
AbstractReporter.INHERITANCE_ERROR = 'Must be implemented by sub-class.';

/**
 * Start streaming the files.
 *
 * @return {*}
 */
AbstractReporter.prototype.run = function()
{
  this.stream = through.obj(
    this.processFile.bind(this),
    this.flush.bind(this)
  );

  return this.stream;
};

/**
 * Called once per file.
 *
 * @abstract
 */
AbstractReporter.prototype.processFile = function()
{
  throw new Error(AbstractReporter.INHERITANCE_ERROR);
};

/**
 * Called after all files have been processed.
 *
 * @abstract
 */
AbstractReporter.prototype.flush = function()
{
  throw new Error(AbstractReporter.INHERITANCE_ERROR);
};

/**
 * @type {AbstractReporter}
 */
module.exports = AbstractReporter;
