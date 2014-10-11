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
AbstractReporter.INHERITANCE_ERROR = 'Method not implemented. ' +
  'Must be overloaded sub a sub-class.';

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
 * Must be overloaded by sub-class.
 */
AbstractReporter.prototype.processFile = function()
{
  throw new Error(AbstractReporter.INHERITANCE_ERROR);
};

/**
 * Called after all files have been processed.
 * Must be overloaded by a sub-class.
 */
AbstractReporter.prototype.flush = function()
{
  throw new Error(AbstractReporter.INHERITANCE_ERROR);
};

/**
 * @type {AbstractReporter}
 */
module.exports = AbstractReporter;
