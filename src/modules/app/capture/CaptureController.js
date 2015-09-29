'use strict';

module.exports = /* @ngInject */
  function CaptureController($window, $document, $scope, $state, WebcamSampler) {
    var videoStream = WebcamSampler.stream;
    if (!videoStream) {
      $state.go('start');
    }
    $scope.videoSrc = WebcamSampler.streamURL;
    $scope.WebcamSampler = WebcamSampler;

    $scope.startCapture = function startCapture() {
      // HACK: I don't want to write a directive just for this
      var elVideo = $document[0].getElementById('the-video');
      WebcamSampler.takeSamples(elVideo, {
        numSamples: 10,
        duration: 1  // seconds
      });
    };

    $scope.startEditing = function startEditing() {
      $state.go('results');
    };
  };
