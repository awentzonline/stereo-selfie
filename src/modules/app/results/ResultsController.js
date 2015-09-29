'use strict';

module.exports = /* @ngInject */
  function ResultsController($document, $timeout, $scope, $state, WebcamSampler, StereoPairFinder) {
    var videoStream = WebcamSampler.stream;
    if (!videoStream) {
      $state.go('start');
    }
    var imageCoords;
    var goalImageOffset = 15;  // magic units

    $scope.isWorking = false;
    $scope.estimatePath = function () {
      $scope.isWorking = true;
      // allow UI to update
      $timeout(function () {
        var imageCoords = StereoPairFinder.findFramePositions(
          WebcamSampler.samples, {}
        );
        var bestPairs = StereoPairFinder.sortedImagePairs(
          WebcamSampler.samples, imageCoords.distances, goalImageOffset
        );
        var bestPair = bestPairs[0];
        // sort left to right
        var iX = imageCoords.positions[bestPair.i].x;
        var jX = imageCoords.positions[bestPair.j].x;
        var a, b;
        if (iX < jX) {
          a = bestPair.i;
          b = bestPair.j;
        } else {
          a = bestPair.j;
          b = bestPair.i;
        }
        // HACK: I'm lazy
        var elCanvas = $document[0].getElementById('output-canvas');
        var img0 = WebcamSampler.samples[0];
        elCanvas.width = img0.width * 2;
        elCanvas.height = img0.height;
        var outputContext = elCanvas.getContext('2d');
        drawImagePair(outputContext, WebcamSampler.samples[a], WebcamSampler.samples[b])
        function drawImagePair(context, a, b) {
          context.putImageData(a, 0, 0);
          context.putImageData(b, a.width, 0);
        }
        $scope.isWorking = false;
      });
    };

    $scope.gotoCapture = function () {
      $state.go('capture');
    };

    $scope.estimatePath();
  };
