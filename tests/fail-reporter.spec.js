'use strict';

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    mocha = require('mocha'),
    File = require('vinyl'),
    through = require('through2'),
    FailReporter = require('../lib/reporters/fail-reporter');

// Setup test tools
chai.should();
chai.use(sinonChai);

describe('Reporter: Fail', function() {
    var failReporter;

    beforeEach(function() {
        failReporter = new FailReporter().run();
    });

    afterEach(function() {
        failReporter = null;
    });

    it('should not output anything when passed a valid file', function(done) {
        sinon.stub(console, 'log');

        var validFile = new File();

        failReporter.on('data', function() {
            console.log.callCount.should.be.equal(0);
            console.log.restore();
            done();
        });

        failReporter.write(validFile);
        failReporter.end();
    });

    it('should emit an error when passed a failed file', function(done) {
        var badFile = new File({path: 'some-fake-file.js'});

        badFile.gjslint = {
            success: false,
            errors: [
                {
                    line: 1,
                    description: 'Some description about the error.'
                }
            ]
        };

        failReporter.on('error', function() {
            done();
        });

        failReporter.write(badFile);
        failReporter.end();
    });
});
