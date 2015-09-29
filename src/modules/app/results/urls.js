'use strict';

module.exports = /* @ngInject */
  function configUrls($stateProvider) {
    $stateProvider
      .state('results', {
        url: '/results',
        views: {
          body: {
            controller: 'ResultsController',
            templateUrl: 'app/results/results.html'
          }
        }
      })
  }
