/*
 * gulp-gjslint
 */

/* jshint global require */
/* jshint global module */
/* jshint global exports */

'use strict';

var gulpGjslint;

var gjslint = require('closure-linter-wrapper').gjslint;
var PluginError = require('gulp-util').PluginError;
var through = require('through2');
var merge = require('merge');

gulpGjslint = function(options)
{
    var stream;

    options = options || {};
    options = merge({
        reporter: {
            name: 'console'
        }
    }, options);

    stream = through.obj(function(file, enc, callback) {
        var self = this;

        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            this.emit('error', new PluginError('gulp-gjslint', 'Streaming not supported'));
            return callback();
        }

        options.src = [file.path];

        gjslint(options, function(err) {
            if (err) {
                this.emit('error', new PluginError('gulp-gjslint', err.description));

                self.push(file);
                return;
            }

            self.push(file);
            callback();
        }.bind(this));
    });

    return stream;
};

module.exports = gulpGjslint;
