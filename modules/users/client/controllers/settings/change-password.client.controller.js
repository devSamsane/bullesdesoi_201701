/**
 * Created by SamS@ne on 01/11/2016.
 */
(function () {
  'use strict';

  angular
    .module('users')
    .controller('ChangePasswordController', ChangePasswordController);

  ChangePasswordController.$inject = ['$scope', '$http', 'Authentication', 'UsersService', 'PasswordValidator', '$mdToast'];

  function ChangePasswordController($scope, $http, Authentication, UsersService, PasswordValidator, $mdToast) {
    var vm = this;

    vm.user = Authentication.user;
    vm.changeUserPassword = changeUserPassword;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

    // Change user password
    function changeUserPassword(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm-passwordForm');

        return false;
      }

      UsersService.changePassword(vm.passwordDetails)
        .then(onChangePasswordSuccess)
        .catch(onChangePasswordError);
    }

    function onChangePasswordSuccess(response) {
      // If successful show success message and clear form
      $mdToast.show(
        $mdToast.simple()
          .textContent('Mot de passe modifié avec succés')
          .theme('success-toast')
      );
      vm.passwordDetails = null;
    }

    function onChangePasswordError(response) {
      var message = response.data.message;
      $mdToast.show(
        $mdToast.simple()
          .textContent(message + ' Echec de la modification du mot de passe')
          .theme('error-toast')
      );
    }
  }
}());
