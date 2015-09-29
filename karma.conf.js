module.exports = function(karma) {
  karma.set({
    frameworks: ['browserify', 'mocha'],
    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-bootstrap/ui-bootstrap.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'tmp/templates.js',
      'src/**/*.js'
    ],
    preprocessors: {
      'tmp/templates.js': ['browserify'],
      'src/**/*.js': ['browserify']
    },
    browsers: ['PhantomJS'],
    browserify: {
      debug: true
    }
  });
}
