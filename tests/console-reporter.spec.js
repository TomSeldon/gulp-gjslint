'use strict';

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    mocha = require('mocha'),
    File = require('vinyl'),
    through = require('through2'),
    ConsoleReporter = require('../lib/reporters/console');

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
        sinon.stub(console, 'log');

        var validFile = new File();

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
            sinon.stub(console, 'log');

            var badFile = new File({path: 'some-fake-file.js'}),
                validFile = new File({path: 'some-other-file.js'}),
                i = 0;

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
                i += 1;

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
        var errStub, file;

        consoleReporter = new ConsoleReporter({fail: true}).run();

        sinon.stub(console, 'log');
        errStub = sinon.stub();
        file = new File({path: 'some-other-file.js'});
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
