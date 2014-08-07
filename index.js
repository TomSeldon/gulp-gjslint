/*
 * gulp-gjslint
 */

/* jshint global require */
/* jshint global module */
/* jshint global exports */

'use strict';

var GulpGjslint = require(__dirname + '/lib/GulpGjslint');

var task;

task = function(options)
{
    var gulpGjslint = new GulpGjslint(options);

    return gulpGjslint.run();
};

module.exports = task;
