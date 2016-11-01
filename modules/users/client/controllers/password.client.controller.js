/**
 * Created by SamS@ne on 01/11/2016.
 */
(function () {
  'use strict';

  angular
    .module('users')
    .controller('PasswordController', PasswordController);

  PasswordController.$inject = ['$scope', '$stateParams', 'UsersService', '$location', 'Authentication', 'PasswordValidator', '$mdToast'];

  function PasswordController($scope, $stateParams, UsersService, $location, Authentication, PasswordValidator, $mdToast) {
    var vm = this;

    vm.resetUserPassword = resetUserPassword;
    vm.askForPasswordReset = askForPasswordReset;
    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    function askForPasswordReset(isValid) {


      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.forgotPasswordForm');

        return false;
      }

      UsersService.requestPasswordReset(vm.credentials)
        .then(onRequestPasswordResetSuccess)
        .catch(onRequestPasswordResetError);
    }

    // Change user password
    function resetUserPassword(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.resetPasswordForm');

        return false;
      }

      UsersService.resetPassword($stateParams.token, vm.passwordDetails)
        .then(onResetPasswordSuccess)
        .catch(onResetPasswordError);
    }

    // Password reset callbacks
    function onRequestPasswordResetSuccess(response) {
      // Show user success message and clear form
      vm.credentials = null;
      $mdToast.show(
        $mdToast.simple()
          .textContent('L\'email de réinitialisation du mot de passe a été envoyé avec succés')
          .theme('success-toast')
      );
    }

    function onRequestPasswordResetError(response) {
      // Show user error message end clear form
      vm.credentials = null;
      $mdToast.show(
        $mdToast.simple()
          .textContent('Echec d\'envoi du mail de réinitialisation du mot de passe')
          .theme('error-toast')
      );
    }

    function onResetPasswordSuccess(response) {
      // Is successful show success message and clear form
      vm.passwordDetails = null;

      // Attach user profile
      Authentication.user = response;
      $mdToast.show(
        $mdToast.simple()
          .textContent('Mot de passe réinitialisé')
          .theme('success-toast')
      );

      // And redirect to the index page
      $location.path('/password/reset/success');
    }

    function onResetPasswordError(response) {
      var message = response.data.message;
      $mdToast.show(
        $mdToast.simple()
          .textContent(message + ' Echec de la réinitialisation du mot de passe')
          .theme('error-toast')
      );
    }
  }
}());
