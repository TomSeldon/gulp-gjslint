'use strict';

/**
 * @constructor
 */
var JshintAdapter = function()
{
};

/**
 * @param {File} file
 * @return {Function}
 * @private
 */
JshintAdapter.createErrorParser_ = function(file)
{
  return function(error) {
    return {
      file: file.relative,
      error: {
        code: 'Warning',
        reason: error.description,
        line: error.line,
        character: '[unknown]'
      }
    };
  };
};

/**
 * @param {File} file
 * @return {File}
 */
JshintAdapter.parseFile = function(file)
{
  file.jshint = {
    success: file.gjslint.success,
    results: [],
    data: [],
    options: {}
  };

  if (!file.jshint.success) {
    file.jshint.results = file.gjslint.results.errors.map(
      JshintAdapter.createErrorParser_(file)
    );
  }

  return file;
};

/**
 * @type {JshintAdapter}
 */
module.exports = JshintAdapter;
