'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mocha = require('mocha');
var File = require('vinyl');
var through = require('through2');
var ConsoleReporter = require('../lib/reporters/console-reporter');

// Setup test tools
chai.should();
chai.use(sinonChai);

describe('Reporter: Console', function() {
  var consoleReporter;

  beforeEach(function() {
    consoleReporter = new ConsoleReporter().run();
  });

  afterEach(function() {
    consoleReporter = null;
  });

  it('should not output anything when passed a valid file', function(done) {
    var validFile = new File();

    sinon.stub(console, 'log');

    consoleReporter.on('data', function() {
      console.log.callCount.should.be.equal(0);
      console.log.restore();
      done();
    });

    consoleReporter.write(validFile);
  });

  it('should output to the console when passed a ' +
    'file containing an error',
    function(done) {
      var badFile = new File({path: 'some-fake-file.js'});
      var validFile = new File({path: 'some-other-file.js'});
      var i = 0;

      sinon.stub(console, 'log');

      badFile.gjslint = {
        success: false,
        results: {
          errors: [
            {
              line: 1,
              description: 'Some description about the error.'
            }
          ]
        }
      };

      consoleReporter.on('data', function() {
        i = i + 1;

        if (i === 2) {
          console.log.should.have.been.called;
          console.log.callCount.should.equal(3);
          console.log.restore();
          done();
        }
      });

      consoleReporter.write(validFile);
      consoleReporter.write(badFile);
    }
  );

  it('should emit an error when initialised with fail=true', function(done) {
    var errStub = sinon.stub();
    var file = new File({path: 'some-other-file.js'});

    consoleReporter = new ConsoleReporter({fail: true}).run();

    sinon.stub(console, 'log');

    file.gjslint = {
      success: false,
      results: {
        errors: [
          {
            line: 1,
            description: 'Some description about the error.'
          }
        ]
      }
    };

    consoleReporter.on('error', errStub);

    consoleReporter.on('data', function() {
      errStub.should.have.been.called;
      console.log.restore();
      done();
    });

    consoleReporter.write(file);
  });
});
