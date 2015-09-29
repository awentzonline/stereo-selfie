'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

module.exports = gulp.task('test', function () {
  runSequence(
    'clean',
    'templates',
    'karma'
  );
});
