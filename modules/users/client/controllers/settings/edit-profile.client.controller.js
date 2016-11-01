/**
 * Created by SamS@ne on 01/11/2016.
 */
(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$scope', '$http', '$location', 'UsersService', 'Authentication', '$mdToast'];

  function EditProfileController($scope, $http, $location, UsersService, Authentication, $mdToast) {
    var vm = this;

    vm.user = Authentication.user;
    vm.updateUserProfile = updateUserProfile;

    // Update a user profile
    function updateUserProfile(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = new UsersService(vm.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'vm.userForm');

        $mdToast.show(
          $mdToast.simple()
            .textContent('Profil édité avec succés')
            .theme('success-toast')
        );
        Authentication.user = response;
      }, function (response) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Echec de l\'édition du profil')
            .theme('error-toast')
        );
      });
    }
  }
}());
