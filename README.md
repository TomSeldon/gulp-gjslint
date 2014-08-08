# gulp-gjslint [![Build Status](https://travis-ci.org/TomSeldon/gulp-gjslint.svg?branch=master)](https://travis-ci.org/TomSeldon/gulp-gjslint)

> Lint Javascript using [Google's Javascript linter](https://developers.google.com/closure/utilities/)

## Install

```bash
$ npm install --save-dev gulp-gjslint
```

## Usage

```js
// See also: Gulpfile.js

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
    success: true,
    errors: [
        {
            line: 1,
            code: 2
            description: 'Missing space before "{"'
        }
    ]
}
```

### gjslint.reporter(name, options)

Write reporter on each file that was processed by `gjslint`.

Currently, only the **console** reporter is available.

#### Reporter: Console

##### Example usage

```js
    .pipe(gjslint())
    .pipe(gjslint.reporter('console');
```

##### Default options:

```js
{
    fail: false // If true, emits an error on failure. Useful for CI servers.
}
```
