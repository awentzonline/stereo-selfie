'use strict';

module.exports = /* @ngInject */
  function ResultsController($document, $timeout, $scope, $state, WebcamSampler, StereoPairFinder) {
    var videoStream = WebcamSampler.stream;
    if (!videoStream) {
      $state.go('start');
    }
    var imageCoords;
    $scope.eyeOffset = 7;  // magic units; maybe pixels?

    $scope.isWorking = false;
    $scope.estimatePath = function () {
      $scope.isWorking = true;
      // allow UI to update
      $timeout(function () {
        var imageCoords = StereoPairFinder.findFramePositions(
          WebcamSampler.samples, {}
        );
        var bestPairs = StereoPairFinder.sortedImagePairs(
          WebcamSampler.samples, imageCoords.distances, $scope.eyeOffset
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
        var width = img0.width,
          height = img0.height;
        elCanvas.width = width * 2;
        elCanvas.height = height;
        var outputContext = elCanvas.getContext('2d');
        drawImagePair(outputContext, WebcamSampler.samples[a], WebcamSampler.samples[b])
        $scope.downloadURL = elCanvas.toDataURL();
        function drawImagePair(context, a, b) {
          context.putImageData(a, 0, 0);
          context.putImageData(b, width, 0);
          // draw reference dots
          var refDotRadius = 5;
          var yPosition = 0.03; // fraction of screen, from top
          var centerX = width / 2;
          var centerY = yPosition * height;
          for (var i = 0; i < 2; i++) {
            context.beginPath();
            context.arc(centerX + width * i, centerY, refDotRadius, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
          }
        }
        $scope.isWorking = false;
      });
    };

    $scope.estimatePath();  // kick it off immediately

    $scope.gotoCapture = function () {
      $state.go('capture');
    };

    $scope.downloadURL = '';
    $scope.downloadImage = function () {

    };
  };
