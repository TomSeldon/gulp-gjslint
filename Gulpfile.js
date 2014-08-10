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

// Output all errors to the console
gulp.task('default', function() {
    return gulp.src('./tests/fixtures/**/*.js')
        .pipe(gjslint())
        .pipe(gjslint.reporter('console'));
});

// Output to the console, but stop and fail on the first error
gulp.task('fail-on-first', function() {
    return gulp.src('./tests/fixtures/**/*.js')
        .pipe(gjslint())
        .pipe(gjslint.reporter('console', {fail: true}));
});

var jshint = require('gulp-jshint');

// Output all failures to the console, and then fail.
gulp.task('fail-after-all', function() {
    return gulp.src('./tests/fixtures/**/*.js')
        .pipe(gjslint())
        .pipe(gjslint.reporter('console'))
        .pipe(gjslint.reporter('fail'));
});

// Usage with jshint-stylish
// Output all failures to the console, and then fail.
gulp.task('jshint-adapter', function() {
    var stylish = require('jshint-stylish/stylish');

    return gulp.src('./tests/fixtures/**/*.js')
        .pipe(gjslint())
        .pipe(gjslint.reporter('jshint', stylish.reporter, {}));
});
