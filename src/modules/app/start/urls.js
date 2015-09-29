'use strict';

module.exports = /* @ngInject */
  function configUrls($stateProvider) {
    $stateProvider
      .state('start', {
        url: '',
        views: {
          body: {
            controller: 'StartController',
            templateUrl: 'app/start/start.html'
          }
        }
      })
  }
