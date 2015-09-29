'use strict';

module.exports = /* @ngInject */
  function WebcamSampler($q, $window, $document, $interval, UserMediaService) {
    var service = {
      stream: null,
      streamURL: '',
      samples: [],
      samplerInterval: null,
      isSampling: false,
      timeLeft: 0,
      init: function () {
        return UserMediaService.getUserMedia({
          audio: false,
          video: true
        }).then(function (stream) {
          service.stream = stream;
          console.log(stream);
          var url = $window.URL || $window.webkitURL;
          service.streamURL = url ? url.createObjectURL(stream) : stream;
        });
      },
      takeSamples: function (video, options) {
        var deferred = $q.defer();
        var canvas = $document[0].createElement('canvas');
        var width = video.videoWidth;
        var height = video.videoHeight;
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d');

        service.samples.length = 0;  // clear
        service.isSampling = true;
        service.timeLeft = options.duration;

        if (service.samplerInterval) {
          $interval.cancel(service.samplerInterval);
        }

        var sampleDelay = options.duration * 1000 / options.numSamples;
        service.samplerInterval = $interval(function () {
          // take the sample
          context.fillRect(0, 0, width, height);
          context.drawImage(video, 0, 0, width, height);
          service.samples.push(context.getImageData(0, 0, width, height))
          // are we done yet?
          if (service.samples.length == options.numSamples) {
            service.isSampling = false;
            $interval.cancel(service.samplerInterval);
          }
          service.timeLeft -= sampleDelay / 1000;
        }, sampleDelay);

        return deferred.promise;
      },
      clearSamples: function () {
        service.samples = [];
      }
    };

    return service;
  };
