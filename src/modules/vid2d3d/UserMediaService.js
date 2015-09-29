'use strict';

module.exports = /* @ngInject */
  function UserMediaService($q, $window, $document) {
    var service = {
      stream: null,
      setStream: function (stream) {
        service.stream = stream;
      },
      getUserMedia: function (options) {
        var deferred = $q.defer();
        var getUserMedia = (
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia
        );

        if (getUserMedia) {
          getUserMedia.call(navigator, options, function (stream) {
            deferred.resolve(stream);
          }, function (error) {
            deferred.reject({
              acquiring: true,
              message: 'Failed to acquire video'
            });
          });
        } else {
          deferred.reject({
            unsupported: true,
            message: 'Sorry, the browser you are using doesn\'t support getUserMedia'
          });
        }

        return deferred.promise;
      }
    }
    return service;
  };
