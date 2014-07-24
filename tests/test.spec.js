'use strict';

var mocha = require('mocha');
var chalk = require('chalk');
var assert = require('assert');
var gutil = require('gulp-util');
var out = process.stdout.write.bind(process.stdout);
var gjslint = require('../index');

it('should lint JS files with gjslint', function(cb) {
    var stream;

    stream = gjslint();

    stream.on('data', function () {
        cb();
    });

    stream.on('error', function (err) {
        assert(/gjslint linting failed!/.test(chalk.stripColor(err.message)));
        cb();
    });

    stream.write(new gutil.File({
        path: 'tests/fixtures/pass.js',
        contents: new Buffer('')
    }));

    stream.write(new gutil.File({
        path: 'tests/fixtures/pass.js',
        contents: new Buffer('')
    }));

    stream.end();
});
