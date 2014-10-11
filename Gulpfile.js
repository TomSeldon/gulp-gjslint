'use strict';

var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var jscs = require('gulp-jscs');
var srcFiles = 'lib/**/*.js';
var testFiles = 'tests/**/*.spec.js';

/**
 * Task: mocha
 *
 * Run unit tests using Mocha and generate
 * code coverage reports using Istanbul.
 */
gulp.task('mocha', function(done) {
  gulp.src(srcFiles)
    .pipe(istanbul())
    .on('finish', function() {
      gulp.src(testFiles)
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .on('end', done);
    })
});

/**
 * Task: lint
 *
 * Lints library and spec files using JSCS.
 */
gulp.task('lint', function() {
  gulp.src([srcFiles, testFiles])
    .pipe(jscs());
});
