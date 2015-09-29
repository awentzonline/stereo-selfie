'use strict';

module.exports = /* @ngInject */
  function StartController($scope, WebcamSampler) {
    $scope.waitingForPermission = true;
    $scope.mediaError = '';

    WebcamSampler.init()
      .then(function (stream) {
        $scope.waitingForPermission = false;
        $scope.mediaError = '';
      })
      .catch(function (err) {
        $scope.waitingForPermission = false;
        $scope.mediaError = err.message;
      });
  };
