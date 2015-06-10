gulp-gjslint
==============
[![NPM version](https://badge.fury.io/js/gulp-gjslint.svg)](http://badge.fury.io/js/gulp-gjslint)
[![Build Status](https://travis-ci.org/TomSeldon/gulp-gjslint.svg?branch=master)](https://travis-ci.org/TomSeldon/gulp-gjslint) [![Code Climate](https://codeclimate.com/github/TomSeldon/gulp-gjslint/badges/gpa.svg)](https://codeclimate.com/github/TomSeldon/gulp-gjslint) [![Test Coverage](https://codeclimate.com/github/TomSeldon/gulp-gjslint/badges/coverage.svg)](https://codeclimate.com/github/TomSeldon/gulp-gjslint)

> Lint Javascript using [Google's Javascript linter](https://developers.google.com/closure/utilities/)

## Install

```bash
$ npm install --save-dev gulp-gjslint
```

## Usage

```js
// See also: Gulpfile.example.js

var gulp = require('gulp'),
    gjslint = require('gulp-gjslint');

// Lint files and output results to the console
gulp.task('default', function() {
    return gulp.src('some/files/**/*.js')
        .pipe(gjslint())
        .pipe(gjslint.reporter('console'));
});

// Lint files, output to console and exit if
// an error is raised (useful for CI servers).
gulp.task('default', function() {
    return gulp.src('some/files/**/*.js')
        .pipe(gjslint())
        .pipe(gjslint.reporter('console'), {fail: true})
});

// Pass options to the linter
// See https://github.com/jmendiara/node-closure-linter-wrapper
var lintOptions = {flags: ['--nojsdoc', '--max_line_length 120']};
gulp.task('default', function() {
    return gulp.src('some/files/**/*.js')
        .pipe(gjslint(lintOptions))
        .pipe(gjslint.reporter('console'));
});
```

## API

Options can be passed to the `gulp-gjslint` task, which will be passed directly
to the `gjslint` library.

See the [library documentation](https://github.com/jmendiara/node-closure-linter-wrapper)
for details on what can be specified.

*Note: The reporter option is disabled. Use the additional reporter tasks as shown in the
examples above.*

### gjslint(options)

Run gjslint on each file.

Writes `gjslint` object to each Vinyl object, e.g.

```js
{
    success: false,
    results: {
        errors: [
            {
                line: 1,
                code: 2
                description: 'Missing space before "{"'
            }
        ],
        total: 1,
        newErrors: 1,
        filesCount: 1,
        filesOK: 0
    }
}
```

### gjslint.reporter(name, options)

Write reporter on each file that was processed by `gjslint`.

#### Reporter: Console

Output results to the console.

##### Example usage

```js
gulp.task('lint', function() {
    var gjslint = require('gulp-gjslint'),
        lintOptions = {},
        reporterOptions = {};

    return gulp.src('./**/*.js')
        .pipe(gjslint(lintOptions))
        .pipe(gjslint.reporter('console', reporterOptions));
```

##### Default options:

```js
{
    fail: false // If true, emits an error on failure. Useful for CI servers.
                // Note: This will cause the task to fail after the first
                // linting error.
}
```

#### Reporter: Fail

Emits an error on when processing a failed file.

Intended for use with a CI server in conjunction with another style of reporter.

##### Example usage

```js
gulp.task('lint', function() {
    var gjslint = require('gulp-gjslint');

    return gulp.src('./**/*.js')
        .pipe(gjslint())
        .pipe(gjslint.reporter('console'))
        .pipe(gjslint.reporter('fail'));
});
```

#### Reporter: Jshint Adapter

Experimental adapter for using Jshint reporters. Only tested with
[jshint-stylish](https://github.com/sindresorhus/jshint-stylish).

Format for usage is:

```js
.pipe(gjslint.reporter('jshint', reporterFunction, reporterOptions));
```

##### Example usage

```js
gulp.task('lint', function() {
    var gjslint = require('gulp-gjslint'),
        stylish = require('jshint-stylish').reporter,
        reporterOptions = {};

    return gulp.src('./**/*.js')
        .pipe(gjslint())
        .pipe(gjslint.reporter('jshint', stylish, reporterOptions));
});
```

## Known issues:

* Poor handling for when `closure-linter-wrapper` blows up.
* Limitation of `closure-linter-wrapper` where errors are not returned when a file fails
  with a large number of errors. The task will still output the names of the failed file(s)
  and the number of errors, but not the errors themselves.

--------

[![NPM](https://nodei.co/npm/gulp-gjslint.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-gjslint/)
