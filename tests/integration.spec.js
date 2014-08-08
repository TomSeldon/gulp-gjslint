'use strict';

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    mocha = require('mocha'),
    File = require('gulp-util').File,
    gulp = require('gulp'),
    gulpGjslint = require('../index');

// Setup test tools
chai.should();
chai.use(sinonChai);

describe('Integration tests with gjslint', function() {
    // Increase Mocha's timeout, as we're testing
    // against a real instance of the linter so it
    // may be slow.
    this.timeout(8000);

    var errSpy;

    beforeEach(function() {
        errSpy = sinon.spy();
    });

    afterEach(function() {
        errSpy = null;
    });

    it('should not emit an error when linting files, ' +
        'whether they fail or not',
        function(done) {
            gulp.src('tests/fixtures/**.js')
                .pipe(gulpGjslint())
                .on('error', errSpy)
                .on('data', function() {
                    errSpy.callCount.should.equal(0);
                    done();
                });
        }
    );
});
