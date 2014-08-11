'use strict';

var JshintAdapter;

/**
 * @param file
 * @returns {*}
 * @constructor
 */
JshintAdapter = function(file)
{
    this.file = file;

    return this.convertFile_();
};

/**
 * @param error
 * @returns {*}
 * @private
 */
JshintAdapter.prototype.convertError_ = function(error)
{
    var result;

    result = {
        file: this.file.relative,
        error: {}
    };

    result.error.code = 'Warning';
    result.error.reason = error.description;
    result.error.line = error.line;
    result.error.character = '[unknown]';

    return result;
};

/**
 * @returns {*}
 * @private
 */
JshintAdapter.prototype.convertFile_ = function()
{
    this.file.jshint = {
        success: this.file.gjslint.success,
        results: [],
        data: [],
        options: {}
    };


    if (!this.file.jshint.success) {
        var results;

        results = this.file.gjslint.results.errors.map(this.convertError_, this);

        this.file.jshint.results = results;
    }

    return this.file;
};

module.exports = JshintAdapter;
