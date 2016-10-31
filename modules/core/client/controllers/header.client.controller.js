/**
 * Created by SamS@ne on 31/10/2016.
 */
(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', '$mdSidenav', '$timeout', 'menuSidenav', 'menuService', '$location', '$rootScope', 'Authentication', '$document', '$mdMenu', '$mdToast'];

  function HeaderController($scope, $state, $mdSidenav, $timeout, menuSidenav, menuService, $location, $rootScope, Authentication, $document, $mdMenu, $mdToast) {
    var vm = this;

    $scope.menuSidenav = menuSidenav;
    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    $scope.title = 'Bulles de Soi';
    $scope.path = path;
    $scope.goHome = goHome;
    $scope.openMenu = openMenu;
    $scope.closeMenu = closeMenu;
    $scope.isSectionSelected = isSectionSelected;

    $scope.isDisabled = isDisabled();
    $scope.isSigninRefLabel = isSigninRefLabel();
    $scope.isSigninRefUrl = isSigninRefUrl();


    $rootScope.$on('$stateChangeSuccess', openPage);
    $scope.focusMainContent = focusMainContent;
    $scope.$on('$stateChangeSuccess', stateChangeSuccess);


    // Define a fake model for the related page selector
    Object.defineProperty($rootScope, 'relatedPage', {
      get: function () {
        return null;
      },
      set: angular.noop,
      enumerable: true,
      configurable: true
    });

    $rootScope.redirectToUrl = function (url) {
      $location.path(url);
      $timeout(function () {
        $rootScope.relatedPage = null;
      }, 100);
    };

    // Methods used by menuLink and menuToggle directives
    this.isOpen = isOpen;
    this.isSelected = isSelected;
    this.toggleOpen = toggleOpen;
    this.autoFocusContent = false;

    var mainContentArea = document.querySelector("[role='main']");

    function closeMenu() {
      $timeout(function () {
        $mdSidenav('left').close();
      });
    }

    function openMenu() {
      $timeout(function () {
        $mdSidenav('left').open();
      });
    }

    function path() {
      return $location.path();
    }

    function goHome($event) {
      menuSidenav.selectPage(null, null);
      $state.go('home');
    }

    function openPage() {
      $scope.closeMenu();

      if (vm.autoFocusContent) {
        focusMainContent();
        vm.autoFocusContent = false;
      }
    }

    function focusMainContent($event) {
      // Prevent skip link from redirecting
      if ($event) {
        $event.preventDefault();
      }
      $timeout(function () {
        mainContentArea.focus();
      }, 90);
    }

    function isSelected(page) {
      return menuSidenav.isPageSelected(page);
    }

    function isSectionSelected(section) {
      var selected = false;
      var openedSection = menuSidenav.openedSection;

      if (openedSection === section) {
        selected = true;
      } else if (section.children) {
        section.children.forEach(function (childSection) {
          if (childSection === openedSection) {
            selected = true;
          }
        });
      }
      return selected;
    }

    function isOpen(section) {
      return menuSidenav.isSectionSelected(section);
    }

    function toggleOpen(section) {
      menuSidenav.toggleSelectSection(section);
    }

    // menuService functions
    function stateChangeSuccess() {
      vm.isCollapsed = false;
    }

    function isDisabled() {
      var showDisabled = true;
      if (Authentication.user) {
        showDisabled = false;
      }

      return showDisabled;
    }

    function isSigninRefUrl() {
      var refUrl = '';
      if (Authentication.user) {
        refUrl = '/api/auth/signout';
      } else {
        refUrl = 'authentication.signin';
      }

      return refUrl;
    }

    function isSigninRefLabel() {
      var refLabel = '';
      if (Authentication.user) {
        refLabel = 'Se déconnecter';
      } else {
        refLabel = 'Se connecter';
      }

      return refLabel;

    }
  }
}());
