/**
 * Created by SamS@ne on 01/11/2016.
 */
(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', '$mdToast'];

  function UserController($scope, $state, $window, Authentication, user, $mdToast) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = user;
    vm.remove = remove;
    vm.update = update;
    vm.isContextUserSelf = isContextUserSelf;

    function remove(user) {
      if ($window.confirm('Etes vous sur de vouloir supprimer cet utilisateur ?')) {
        if (user) {
          user.$remove();

          vm.users.splice(vm.users.indexOf(user), 1);
          $mdToast.show(
            $mdToast.simple()
              .textContent('Utilisateur supprimé avec succès')
              .theme('success-toast')
          );
        } else {
          vm.user.$remove(function () {
            $state.go('admin-users');
            $mdToast.show(
              $mdToast.simple()
                .textContent('Utilisateur supprimé avec succès')
                .theme('success-toast')
            );
          });
        }
      }
    }

    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }
      var user = vm.user;
      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        $mdToast.show(
          $mdToast.simple()
            .textContent('Utilisateur enregistré avec succès')
            .theme('success-toast')
        );
      }, function (errorResponse) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Echec de la mise à jour de l\'utilisateur')
            .theme('error-toast')
        );
      });
    }

    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }
  }
}());
