'use strict';

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    mocha = require('mocha'),
    File = require('gulp-util').File,
    PluginError = require('gulp-util').PluginError,
    rewire = require('rewire'),
    GulpGjslint = require('../lib/GulpGjslint');

// Setup test tools
chai.should();
chai.use(sinonChai);

describe('Error creation', function() {
    var gulpGjslint;

    beforeEach(function() {
        gulpGjslint = new GulpGjslint();
    });

    afterEach(function() {
        gulpGjslint = null;
    });

    it('should have a method for logging an error', function() {
        gulpGjslint.should.have.property('createError');
    });

    it('should return a PluginError instance when called', function() {
        var err;

        err = gulpGjslint.createError('some message');

        err.should.be.an.instanceof(PluginError);
    });

    it('should create a PluginError instance with the ' +
        'correct message and plugin name',
        function() {
            var err;

            err = gulpGjslint.createError('some message');

            err.plugin.should.equal('gulp-gjslint');
            err.message.should.equal('some message');
        }
    );
});
