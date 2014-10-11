'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var File = require('vinyl');
var rewire = require('rewire');
var GulpGjslint = rewire('../lib/GulpGjslint');

// Setup test tools
chai.should();
chai.use(sinonChai);

describe('Parsing a linted file', function() {
  var gulpGjslint;
  var mockGjslint;
  var mockLintError;
  var file;

  beforeEach(function() {
    mockGjslint = sinon.stub();
    mockGjslint.callsArg(1);

    mockLintError = {
      info: {
        fails: [
          {
            errors:
              [
                {
                  line: 5,
                  code: 2,
                  description: 'foo'
                }
              ]
          }
        ]
      }
    };

    GulpGjslint.__set__('gjslint', mockGjslint);

    gulpGjslint = new GulpGjslint();
    file = new File({path: './some-fake-file.js'});
  });

  afterEach(function() {
    gulpGjslint = null;
    mockGjslint = null;
    mockLintError = null;
    file = null;
  });

  it('should attach linting result data to each file', function() {

    file.should.not.have.property('gjslint');

    file = gulpGjslint.parseResults(file, null);

    file.should.have.property('gjslint');
    file.gjslint.should.have.property('success');
  });

  it('should set a success flag to true when ' +
    'called without an error object',
    function() {
      file = gulpGjslint.parseResults(file, null);
      file.gjslint.should.have.property('success', true);
    }
  );

  it('should set a success flag to false when ' +
    'called with an error object',
    function() {
      file = gulpGjslint.parseResults(file, mockLintError);
      file.gjslint.should.have.property('success', false);
    }
  );

  it('should attach an array of errors to the file' +
    'when linting has failed',
    function() {
      var results;

      file = gulpGjslint.parseResults(file, mockLintError);

      results = file.gjslint.results;

      file.gjslint.should.have.property('results');
      results.should.have.property('errors');
      results.errors.length.should.equal(1);
      results.errors[0].should.have.property('code');
      results.errors[0].should.have.property('line');
      results.errors[0].should.have.property('description');
    }
  );
});
