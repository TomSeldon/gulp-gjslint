'use strict';

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    mocha = require('mocha'),
    File = require('gulp-util').File,
    rewire = require('rewire'),
    GulpGjslint = rewire('../lib/GulpGjslint');

// Setup test tools
chai.should();
chai.use(sinonChai);

describe('Options parsing', function() {
    var gulpGjslint, mockGjslint;

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
        var options, expectedOptions, mockFile;

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

        mockFile = new File({path: './fake.js'});

        gulpGjslint = new GulpGjslint(options);
        gulpGjslint.processFile(mockFile);

        mockGjslint.should.have.been.calledWith(expectedOptions);
    });
});
