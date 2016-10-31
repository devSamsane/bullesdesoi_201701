/**
 * Created by SamS@ne on 31/10/2016.
 */
(function () {
  'use strict';

  angular
    .module('core.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // If last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/modules/core/client/views/home.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('not-found', {
        url: '/not-found',
        templateUrl: '/modules/core/client/views/404.client.view.html',
        controller: 'ErrorController',
        controllerAs: 'vm',
        params: {
          message: function ($stateParams) {
            return $stateParams.message;
          }
        },
        data: {
          ignoreState: true,
          pageTitle: 'Page non trouvée'
        }
      })
      .state('bad-request', {
        url: '/bad-request',
        templateUrl: '/modules/core/client/views/400.client.view.html',
        controller: 'ErrorController',
        controllerAs: 'vm',
        params: {
          message: function ($stateParams) {
            return $stateParams.message;
          }
        },
        data: {
          ignoreState: true,
          pageTitle: 'Requête incorrecte'
        }
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: '/modules/core/client/views/403.client.view.html',
        data: {
          ignoreState: true,
          pageTitle: 'Accès interdit'
        }
      })
      .state('adolescence', {
        url: '/adolescence',
        templateUrl: '/modules/core/client/views/site/adolescence.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('adulte', {
        url: '/adulte',
        templateUrl: '/modules/core/client/views/site/adulte.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('amonpropos', {
        url: '/a_mon_propos',
        templateUrl: '/modules/core/client/views/site/a-mon-propos.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('ensavoirplus', {
        url: '/en_savoir_plus',
        templateUrl: '/modules/core/client/views/site/en-savoir-plus.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('deontologie', {
        url: '/deontologie',
        templateUrl: '/modules/core/client/views/site/deontologie.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('sophrologie', {
        url: '/sophrologie',
        templateUrl: '/modules/core/client/views/site/sophrologie.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('enfance', {
        url: '/enfance',
        templateUrl: '/modules/core/client/views/site/enfance.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('localisation', {
        url: '/localisation',
        templateUrl: '/modules/core/client/views/site/localisation.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('perinatalite', {
        url: '/perinatalite',
        templateUrl: '/modules/core/client/views/site/perinatalite.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('prestations', {
        url: '/prestations',
        templateUrl: '/modules/core/client/views/site/prestations.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('rdv', {
        url: '/rdv',
        templateUrl: '/modules/core/client/views/site/rdv.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('senior', {
        url: '/senior',
        templateUrl: '/modules/core/client/views/site/senior.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('tarifs', {
        url: '/tarifs',
        templateUrl: '/modules/core/client/views/site/tarifs.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      });
  }
}());
