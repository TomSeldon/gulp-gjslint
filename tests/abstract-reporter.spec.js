'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
var File = require('vinyl');
var AbstractReporter = require('../lib/reporters/abstract-reporter');

// Setup test tools
chai.should();
chai.use(sinonChai);

describe('Abstract reporter', function() {
  var abstractReporter;

  beforeEach(function() {
    abstractReporter = new AbstractReporter();
  });

  it('should not allow the abstract method "processFile" to run', function() {
    var fn = function() {
      abstractReporter.processFile();
    };

    fn.should.throw(AbstractReporter.INHERITANCE_ERROR);
  });

  it('should not allow the abstract method "flush" to run', function() {
    var fn = function() {
      abstractReporter.flush();
    };

    fn.should.throw(AbstractReporter.INHERITANCE_ERROR);
  });
});
