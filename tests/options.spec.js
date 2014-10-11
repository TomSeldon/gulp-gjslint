'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var File = require('gulp-util').File;
var rewire = require('rewire');
var GulpGjslint = rewire('../lib/GulpGjslint');

// Setup test tools
chai.should();
chai.use(sinonChai);

describe('Options parsing', function() {
  var gulpGjslint;
  var mockGjslint;

  beforeEach(function() {
    mockGjslint = sinon.stub();

    GulpGjslint.__set__('gjslint', mockGjslint);
  });

  afterEach(function() {
    gulpGjslint = null;
  });

  it('should use some default options if none are specified', function() {
    gulpGjslint = new GulpGjslint();

    gulpGjslint.options.should.deep.equal(GulpGjslint.DEFAULT_OPTIONS);
    gulpGjslint.options.should.have.property('reporter', null);
  });

  it('should merge any passed config with the defaults', function() {
    gulpGjslint = new GulpGjslint({
      foo: 'bar'
    });

    gulpGjslint.options.should.have.property('foo', 'bar');
    gulpGjslint.options.should.have.property('reporter', null);
  });

  it('should force the reporter to be null', function() {
    gulpGjslint = new GulpGjslint({
      reporter: 'foo'
    });

    gulpGjslint.options.should.have.property('reporter', null);
  });

  it('should pass the specified options to gjslint', function() {
    var options;
    var expectedOptions;
    var mockFile = new File({path: './fake.js'});

    options = {
      foo: 'bar',
      zip: 'zap'
    };

    expectedOptions = {
      foo: 'bar',
      zip: 'zap',
      reporter: null,
      src: ['./fake.js']
    };

    gulpGjslint = new GulpGjslint(options);
    gulpGjslint.processFile(mockFile);

    mockGjslint.should.have.been.calledWith(expectedOptions);
  });
});
