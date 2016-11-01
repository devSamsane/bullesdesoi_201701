/**
 * Created by SamS@ne on 01/11/2016.
 */
(function () {
  'use strict';

  // PasswordValidator service used for testing the password strength
  angular
    .module('users.services')
    .factory('PasswordValidator', PasswordValidator);

  PasswordValidator.$inject = ['$window'];

  function PasswordValidator($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    var service = {
      getResult: getResult,
      getPopoverMsg: getPopoverMsg
    };

    return service;

    function getResult(password) {
      var result = owaspPasswordStrengthTest.test(password);
      return result;
    }

    function getPopoverMsg() {
      var popoverMsg = 'Entrez une passphrase ou un password avec ' + owaspPasswordStrengthTest.configs.minLength + ' ou plus de caractères, chiffres, minuscules, majuscules et caractères spéciaux.';

      return popoverMsg;
    }
  }
}());
