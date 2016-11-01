/**
 * Created by SamS@ne on 01/11/2016.
 */

(function () {
  'use strict';

  angular
    .module('users')
    .directive('passwordValidator', passwordValidator);

  passwordValidator.$inject = ['PasswordValidator'];

  function passwordValidator(PasswordValidator) {
    var directive = {
      require: 'ngModel',
      link: link
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
      ngModel.$validators.requirements = function (password) {
        var status = true;
        if (password) {
          var result = PasswordValidator.getResult(password);
          var requirementsIdx = 0;

          // Requirements meter - visual indicators for users
          var requirementsMeter = [{
            color: 'red-500',
            progress: '20'
          }, {
            color: 'red-200',
            progress: '40'
          }, {
            color: 'orange-500',
            progress: '60'
          }, {
            color: 'yellow-500',
            progress: '80'
          }, {
            color: 'green-500',
            progress: '100'
          }];
          if (result.errors.length < requirementsMeter.length) {
            requirementsIdx = requirementsMeter.length - result.errors.length - 1;
          }

          scope.requirementsColor = requirementsMeter[requirementsIdx].color;
          scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

          if (result.errors.length) {
            scope.getPopoverMsg = PasswordValidator.getPopoverMsg();
            scope.passwordErrors = result.errors;
            status = false;
          } else {
            scope.getPopoverMsg = '';
            scope.passwordErrors = [];
            status = true;
          }
        }

        return status;
      };
    }
  }
}());
