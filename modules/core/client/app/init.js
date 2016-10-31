(function (app) {
  'use strict';

  // Start by defining the main module and adding the module dependencies
  angular
    .module(app.applicationModuleName, app.applicationModuleVendorDependencies);

  // Setting HTML5 location mode
  angular
    .module(app.applicationModuleName)
    .config(bootstrapConfig);

  bootstrapConfig.$inject = ['$compileProvider', '$locationProvider', '$httpProvider', '$logProvider', '$mdThemingProvider', '$mdIconProvider'];

  function bootstrapConfig($compileProvider, $locationProvider, $httpProvider, $logProvider, $mdThemingProvider, $mdIconProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    }).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');

    // @theme : 'default' [md-primary | md-hue-1 | md-hue-2 | md-hue-3]
    // primary : deep-purple [500 | 300 | 800 | A100]
    // warn : pink [500 | 300 | 800 | A100]
    // accent : lime [A200 | A100 | A400 | A700]
    // background : deep-purple [50] #EDE7F6
    $mdThemingProvider.theme('default')
      .primaryPalette('deep-purple', {
        'default': '500',
        'hue-1': '300',
        'hue-2': '700',
        'hue-3': 'A100'
      })
      .warnPalette('pink')
      .accentPalette('lime')
      .backgroundPalette('deep-purple', {
        'default': '50'
      });
    // @theme : toast notifications
    $mdThemingProvider.theme('error-toast')
      .backgroundPalette('pink', {
        'default': '500'
      })
      .dark;

    $mdThemingProvider.theme('success-toast')
      .backgroundPalette('lime', {
        'default': '500'
      });

    $mdIconProvider
      .iconSet('hardware', '/lib/material-design-icons/sprites/svg-sprite/svg-sprite-hardware.svg')
      .iconSet('alert', '/lib/material-design-icons/sprites/svg-sprite/svg-sprite-alert.svg')
      .iconSet('notification', '/lib/material-design-icons/sprites/svg-sprite/svg-sprite-notification.svg')
      .iconSet('maps', '/lib/material-design-icons/sprites/svg-sprite/svg-sprite-image.svg')
      .iconSet('navigation', '/lib/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg')
      .iconSet('toggle', '/lib/material-design-icons/sprites/svg-sprite/svg-sprite-toggle.svg')
      .iconSet('content', '/lib/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg')
      .iconSet('communication', '/lib/material-design-icons/sprites/svg-sprite/svg-sprite-communication.svg')
      .iconSet('action', '/lib/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg')
      .iconSet('social', '/lib/material-design-icons/sprites/svg-sprite/svg-sprite-social.svg')
      .iconSet('editor', '/lib/material-design-icons/sprites/svg-sprite/svg-sprite-editor.svg')
      .icon('logo', 'modules/core/client/img/svg/bullesdesoi.svg')
      .icon('hands', 'modules/core/client/img/svg/hands.svg')
      .icon('brain', 'modules/core/client/img/svg/healthy-brain.svg')
      .icon('adulte', 'modules/core/client/img/svg/bucket-adulte.svg')
      .icon('perinatalite', 'modules/core/client/img/svg/bucket-perinatalite.svg')
      .icon('enfance', 'modules/core/client/img/svg/bucket-enfance.svg')
      .icon('ado', 'modules/core/client/img/svg/bucket-ado.svg');

    // Disable debug data for production environment
    // @link : https://doc.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(app.applicationEnvironment !== 'production');
    $logProvider.debugEnabled(app.applicationEnvironment !== 'production');

  }

  // Then define the init function for starting up the application
  angular.element(document).ready(init);

  function init() {
    // Fixing the facebook bug with redirect
    if (window.location.hash && window.location.hash === '#_=_') {
      if (window.history && history.pushState) {
        window.history.pushState('', document.title, window.location.pathname);
      } else {
        // Prevent scrolling by storing the page's current scroll offset
        var scroll = {
          top: document.body.scrollTop,
          left: document.body.scrollLeft
        };
        window.location.hash = '';
        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scroll.top;
        document.body.scrollLeft = scroll.left;
      }
    }

    // Then init the app
    angular.bootstrap(document, [app.applicationModuleName]);
  }
}(ApplicationConfiguration));
