'use strict';

module.exports = angular.module('stereoSelfie.start', [
  ])
  .config(require('./urls'))
  .controller('StartController', require('./StartController'))
