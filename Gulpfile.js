'use strict';

/**
 * This is an example Gulpfile showing how you might use this plugin.
 *
 * gjslint()
 * =========
 * Lints the files but doesn't output anything
 *
 * gjslint.reporter('console')
 * ===========================
 * Logs details of failed files to the console
 */

var gulp = require('gulp'),
    gjslint = require('./index');

gulp.task('default', function() {
    return gulp.src('./tests/fixtures/**/*.js')
        .pipe(gjslint())
        .pipe(gjslint.reporter('console'));
});

gulp.task('default', function() {
    return gulp.src('./tests/fixtures/**/*.js')
        .pipe(gjslint())
        .pipe(gjslint.reporter('console', {fail: true}));
});
