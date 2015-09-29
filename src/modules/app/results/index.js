'use strict';

module.exports = angular.module('stereoSelfie.results', [
  ])
  .config(require('./urls'))
  .controller('ResultsController', require('./ResultsController'))
