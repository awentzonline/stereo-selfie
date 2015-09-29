'use strict';

module.exports = angular.module('vid2d3d', [
  ])
  .factory('UserMediaService', require('./UserMediaService'))
  .factory('WebcamSampler', require('./WebcamSampler'))
  .factory('StereoPairFinder', require('./StereoPairFinder'))
  .directive('dynamicUrl', function () {
    // http://forum.ionicframework.com/t/ng-src-not-updated-in-video-tag/7540/5
    return {
      restrict: 'A',
      link: function postLink(scope, element, attr) {
        element.attr('src', attr.dynamicUrlSrc);
      }
    };
  });
