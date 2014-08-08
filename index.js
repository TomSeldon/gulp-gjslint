/*
 * gulp-gjslint
 */

'use strict';

var GulpGjslint = require(__dirname + '/lib/GulpGjslint');

var task;

task = function(options)
{
    var gulpGjslint = new GulpGjslint(options);

    return gulpGjslint.run();
};

module.exports = task;
module.exports.reporter = GulpGjslint.reporter;
