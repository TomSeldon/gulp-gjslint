'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
var reporterFactory = require('../lib/reporters');

// Setup test tools
chai.should();
chai.use(sinonChai);

describe('Reporter factory', function() {
  it('should allow creation of valid reporters', function() {
    createConsoleReporter.should.not.throw();
    createFailReporter.should.not.throw();
    createJshintReporter.should.not.throw();

    function createConsoleReporter() {
      var ConsoleReporter = require('../lib/reporters/console-reporter');

      reporterFactory(ConsoleReporter.REPORTER_NAME);
    }

    function createFailReporter() {
      var FailReporter = require('../lib/reporters/fail-reporter');

      reporterFactory(FailReporter.REPORTER_NAME);
    }

    function createJshintReporter() {
      var JshintReporter = require('../lib/reporters/jshint-reporter');

      reporterFactory(JshintReporter.REPORTER_NAME);
    }
  });

  it('should throw an error when attempting to create invalid ' +
    'reporters', function() {
    createInvalidReporter.should.throw();

    function createInvalidReporter() {
      reporterFactory('some fake reporter');
    }
  });
});
