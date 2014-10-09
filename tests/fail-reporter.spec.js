'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mocha = require('mocha');
var File = require('vinyl');
var through = require('through2');
var FailReporter = require('../lib/reporters/fail-reporter');

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
    var validFile = new File();

    sinon.stub(console, 'log');

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
