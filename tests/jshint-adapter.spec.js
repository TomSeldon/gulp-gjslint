'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mocha = require('mocha');
var File = require('vinyl');
var through = require('through2');
var JshintAdapter = require('../lib/util/jshint-adapter');

// Setup test tools
chai.should();
chai.use(sinonChai);

describe('Jshint Reporter Adapter', function() {
  it(
    'should convert a successful gjslint result object ' +
      'into a jshint compatible one',
    function() {
      var file = new File();
      var parsedFile;

      file.gjslint = {
        success: true
      };

      parsedFile = JshintAdapter.parseFile(file);

      parsedFile.should.have.property('jshint');
      parsedFile.jshint.should.have.property('success', true);
    }
  );

  it(
    'should convert a failed gjslint result object ' +
      'into a jshint compatible one',
    function() {
      var parsedFile;
      var file = new File({path: './fake.js'});
      var mockError = {
        code: 2,
        line: 10,
        description: 'foo'
      };

      file.gjslint = {
        success: false,
        results: {
          errors: [mockError]
        }
      };

      parsedFile = JshintAdapter.parseFile(file);

      parsedFile.should.have.property('jshint');
      parsedFile.jshint.should.have.property('success', false);
      parsedFile.jshint.should.have.property('results');
      parsedFile.jshint.results.length.should.equal(1);

      parsedFile.jshint.results[0].error.reason
        .should.equal(mockError.description);

      parsedFile.jshint.results[0].error.code
        .should.equal('Warning');

      parsedFile.jshint.results[0].error.line
        .should.equal(mockError.line);
    }
  );
});
