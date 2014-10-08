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
    it(
        'should convert a successful gjslint result object ' +
            'into a jshint compatible one',
        function() {
            var file, parsedFile;

            file = new File();

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
            var file, parsedFile, mockError;

            file = new File({path: './fake.js'});

            mockError = {
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
