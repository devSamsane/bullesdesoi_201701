/**
 * Created by SamS@ne on 01/11/2016.
 */
(function () {
  'use strict';

  angular
    .module('users')
    .controller('SocialAccountsController', SocialAccountsController);

  SocialAccountsController.$inject = ['$state', '$window', 'UsersService', 'Authentication', '$mdToast'];

  function SocialAccountsController($state, $window, UsersService, Authentication, $mdToast) {
    var vm = this;

    vm.user = Authentication.user;
    vm.hasConnectedAdditionalSocialAccounts = hasConnectedAdditionalSocialAccounts;
    vm.isConnectedSocialAccount = isConnectedSocialAccount;
    vm.removeUserSocialAccount = removeUserSocialAccount;
    vm.callOauthProvider = callOauthProvider;

    // Check if there are additional accounts
    function hasConnectedAdditionalSocialAccounts() {
      return (vm.user.additionalProvidersData && Object.keys(vm.user.additionalProvidersData).length);
    }

    // Check if provider is already in use with current user
    function isConnectedSocialAccount(provider) {
      return vm.user.provider === provider || (vm.user.additionalProvidersData && vm.user.additionalProvidersData[provider]);
    }

    // Remove a user social account
    function removeUserSocialAccount(provider) {

      UsersService.removeUserSocialAccount(provider)
        .then(onRemoveSocialAccountSuccess)
        .catch(onRemoveSocialAccountError);
    }

    function onRemoveSocialAccountSuccess(response) {
      // Is successful show success message and clear form
      $mdToast.show(
        $mdToast.simple()
          .textContent('Association du compte supprimé')
          .theme('success-toast')
      );
      vm.user = Authentication.user = response;
    }

    function onRemoveSocialAccountError(response) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Echec de la suppression de l\'association du compte')
          .theme('error-toast')
      );
    }

    // OAuth provider request
    function callOauthProvider(url) {
      url += '?redirect_to=' + encodeURIComponent($state.$current.url.prefix);

      // Effectively call OAuth authentication route
      $window.location.href = url;
    }
  }
}());
