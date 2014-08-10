'use strict';

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    mocha = require('mocha'),
    File = require('vinyl'),
    through = require('through2'),
    JshintAdapter = require('../lib/util/jshint-adapter');

// Setup test tools
chai.should();
chai.use(sinonChai);

describe('Jshint Reporter Adapter', function() {
    var jshintAdapter;

    beforeEach(function() {
        jshintAdapter = new JshintAdapter().run();
    });

    afterEach(function() {
        jshintAdapter = null;
    });

    it(
        'should convert the gjslint result object into a jshint compatible one',
        function(done) {
            var file = new File();

            file.gjslint = {
                success: true
            };

            jshintAdapter.on('data', function() {
                file.should.have.property('jshint');
                done();
            });

            jshintAdapter.write(file);
        }
    );

    it('should copy', function(done) {
        sinon.stub(console, 'log');

        var validFile = new File();

        jshintAdapter.on('data', function() {
            console.log.callCount.should.be.equal(0);
            console.log.restore();
            done();
        });

        jshintAdapter.write(validFile);
    });
});
