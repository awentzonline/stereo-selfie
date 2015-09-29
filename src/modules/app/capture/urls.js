'use strict';

module.exports = /* @ngInject */
  function configUrls($stateProvider) {
    $stateProvider
      .state('capture', {
        url: '/capture',
        views: {
          body: {
            controller: 'CaptureController',
            templateUrl: 'app/capture/capture.html'
          }
        }
      })
  }
