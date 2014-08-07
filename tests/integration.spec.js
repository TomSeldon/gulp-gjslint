'use strict';

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    mocha = require('mocha'),
    File = require('gulp-util').File,
    assert = require('assert'),
    gulp = require('gulp'),
    gulpGjslint = require('../index');

// Setup test tools
chai.should();
chai.use(sinonChai);

describe('Integration tests with gjslint', function() {
    var errSpy;

    beforeEach(function() {
        errSpy = sinon.spy();
    });

    afterEach(function() {
        errSpy = null;
    });

    it('should not emit an error when linting a valid file', function(done) {
        gulp.src('tests/fixtures/pass.js')
            .pipe(gulpGjslint())
            .on('error', errSpy)
            .on('data', function() {
                errSpy.callCount.should.equal(0);
                done();
            });
    });

    it('should emit an error when linting an invalid file', function(done) {
        gulp.src('tests/fixtures/fail.js')
            .pipe(gulpGjslint())
            .on('error', errSpy)
            .on('data', function() {
                errSpy.callCount.should.equal(1);
                done();
            });
    });

    it('should emit the correct number of errors when passed ' +
            'a mixture of valid and invalid files',

        function(done) {
            var i = 0,
                mockFiles = [
                    __dirname + '/fixtures/pass.js',
                    __dirname + '/fixtures/fail.js',
                    __dirname + '/fixtures/pass2.js',
                    __dirname + '/fixtures/fail2.js'
                ];

            gulp.src(mockFiles)
                .pipe(gulpGjslint())
                .on('error', errSpy)
                .on('data', function(data) {
                    i += 1;

                    if (i === 4) {
                        errSpy.callCount.should.equal(2);
                        done();
                    }
                });
        }
    );
});
