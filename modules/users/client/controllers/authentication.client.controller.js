/**
 * Created by SamS@ne on 01/11/2016.
 */
(function () {
  'use strict';

  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['$scope', '$state', 'UsersService', '$location', '$window', 'Authentication', 'PasswordValidator', '$mdToast'];

  function AuthenticationController($scope, $state, UsersService, $location, $window, Authentication, PasswordValidator, $mdToast) {
    var vm = this;

    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.signup = signup;
    vm.signin = signin;
    vm.callOauthProvider = callOauthProvider;
    vm.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;

    // Get an eventual error defined in the url query string
    if ($location.search().err) {
      var message = $location.search().err;
      $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .theme('error-toast')
      );
    }

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    function signup(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }
      UsersService.userSignup(vm.credentials)
        .then(onUserSignupSuccess)
        .catch(onUserSignupError);
    }

    function signin(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      UsersService.userSignin(vm.credentials)
        .then(onUserSigninSuccess)
        .catch(onUserSigninError);
    }

    // Oauth provider request
    function callOauthProvider(url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call Oauth authentication route
      $window.$location.href = url;
    }

    // Authentication callbacks
    function onUserSignupSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.user = response;
      $mdToast.show(
        $mdToast.simple()
          .textContent('Compté créé avec succés')
          .theme('success-toast')
      );
      // And redirect to the previous or home page
      $state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onUserSignupError(response) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Erreur de création du compte')
          .theme('error-toast')
      );
    }

    function onUserSigninSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.user = response;
      var message = 'Bienvenue ' + response.firstName;
      $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .theme('success-toast')
      );
      // And redirect to the previous or home page
      $state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onUserSigninError(response) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Erreur d\'authentification')
          .theme('error-toast')
      );
    }
  }
}());
