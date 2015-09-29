'use strict';

var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var browserifyShim = require('browserify-shim');

module.exports = gulp.task('watchify', function () {
  var bundler = watchify({
    entries: [config.paths.src.modules]
  });

  bundler.transform(browserifyShim);

  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle({ debug: true })
      .pipe(source(config.filenames.build.scripts))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(config.paths.dest.build.scripts));
  }

  return rebundle();
});
