/**
 * Created by SamS@ne on 01/11/2016.
 */
(function () {
  'use strict';

  angular
    .module('users')
    .controller('ChangeProfilePictureController', ChangeProfilePictureController);

  ChangeProfilePictureController.$inject = ['$timeout', 'Authentication', 'Upload', '$mdToast'];

  function ChangeProfilePictureController($timeout, Authentication, Upload, $mdToast) {
    var vm = this;
    vm.user = Authentication.user;

    vm.upload = function (dataUrl) {

      Upload.upload({
        url: '/api/users/picture',
        data: {
          newProfilePicture: dataUrl
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response.data);
        });
      }, function (response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function (evt) {
        vm.progress = parseInt(100.0 * (evt.loaded / evt.total), 10);
      });
    };

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show success message
      $mdToast.show(
        $mdToast.simple()
          .textContent('Avatar du profil modifié avec succés')
          .theme('success-toast')
      );

      // Populate user object
      vm.user = Authentication.user = response;

      // Reset form
      vm.fileSelected = false;
      vm.progress = 0;
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      vm.fileSelected = false;

      // Show error message
      var message = response.message;
      $mdToast.show(
        $mdToast.simple()
          .textContent(message + ' Echec de mise à jour de l\'avatar du profil')
          .theme('error-toast')
      );
    }
  }
}());
