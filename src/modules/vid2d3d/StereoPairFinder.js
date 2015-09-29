'use strict';

var jsfeat = require('jsfeat');
var videostab = require('./vendor/videostab');
// hacked in from the example
require('./vendor/keypoint_motion_estimator');

module.exports = /* @ngInject */
  function StereoPairFinder() {
    var service = {
      findFramePositions: function (images, options) {
        jsfeat.fast_corners.set_threshold(options.threshold || 20);

        var pairs = []
        // detect features
        var features = [];
        var image0 = images[0];  // used to determine width/height of images
        var frameSize = new videostab.size_t(image0.width, image0.height);
        var motionEstimator = new videostab.keypoint_motion_estimator(videostab.MM_HOMOGRAPHY, frameSize);
        // pre-process images
        var imageMs = [];
        for (var i = 0; i < images.length; i++) {
          var imageData = images[i];
          var gray = new jsfeat.matrix_t(frameSize.width, frameSize.height, jsfeat.U8C1_t);
          jsfeat.imgproc.grayscale(imageData.data, frameSize.width, frameSize.height, gray);
          imageMs.push(gray);
        }
        // estimate camera path
        var framePositions = [new jsfeat.matrix_t(1, 3, jsfeat.F32_t | jsfeat.C1_t)];
        var position = new jsfeat.matrix_t(1, 3, jsfeat.F32_t | jsfeat.C1_t);
        var ident = new jsfeat.matrix_t(1, 3, jsfeat.F32_t | jsfeat.C1_t);
        jsfeat.matmath.identity(ident);
        for (var i = 0; i < imageMs.length - 1; i++) {
          var imageA = imageMs[i];
          var imageB = imageMs[i + 1];
          var motion = motionEstimator.estimate(imageA, imageB);
          var thisOffset = new jsfeat.matrix_t(1, 3, jsfeat.F32_t | jsfeat.C1_t);
          jsfeat.matmath.multiply(thisOffset, motion, ident);
          position.data[0] += thisOffset.data[0];
          position.data[1] += thisOffset.data[1];
          position.data[2] += thisOffset.data[2];
          var thisPosition = new jsfeat.matrix_t(1, 3, jsfeat.F32_t | jsfeat.C1_t);
          position.copy_to(thisPosition);
          framePositions.push(thisPosition);
        }
        // find distances between pairs
        var distances = {};
        for (var i = 0; i < framePositions.length; i++) {
          var pI = framePositions[i];
          for (var j = i + 1; j < framePositions.length; j++) {
            var pJ = framePositions[j];
            var dx = Math.abs(pI.data[1] - pJ.data[1]);
            var info = [i, j, dx];
            distances[[i,j]] = {
              dx: dx
            };
          }
        }
        // match up best pairs
        return {
          positions: framePositions,
          distances: distances
        };
      },
      sortedImagePairs: function (images, distances, goalImageOffset) {
        var scores = [];
        for (var i = 0; i < images.length; i++) {
          for (var j = i + 1; j < images.length; j++) {
            var distance = distances[[i,j]];
            var thisDx = Math.abs(goalImageOffset - distance.dx);
            scores.push({
              i: i, j:j, dx: thisDx
            });
          }
        }
        scores.sort(function (a, b) {
          return a.dx - b.dx;
        });
        return scores;
      }
    };
    return service;
  };
