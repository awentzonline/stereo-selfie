'use strict';

module.exports = angular.module('stereoSelfie.capture', [
  ])
  .config(require('./urls'))
  .controller('CaptureController', require('./CaptureController'))
