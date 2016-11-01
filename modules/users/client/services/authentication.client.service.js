/**
 * Created by SamS@ne on 01/11/2016.
 */
(function () {
  'use strict';

  // Authentication service for users variables
  angular
    .module('users.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$window'];

  function Authentication($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
}());
