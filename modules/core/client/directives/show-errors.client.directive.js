/**
 * Created by SamS@ne on 31/10/2016.
 */
(function () {
  'use strict';

  angular
    .module('core')
    .directive('showErrors', showErrors);

  showErrors.$inject = ['$timeout', '$interpolate'];

  function showErrors($timeout, $interpolate) {
    var directive = {
      restrict: 'A',
      require: '^form',
      compile: compile
    };

    return directive;

    function compile(elem, attrs) {
      if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
        if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
          throw new Error('show-errors element does not have the \'form-group\' or \'input-group\' class');
        }
      }

      return linkFn;

      function linkFn(scope, el, attrs, formCtrl) {
        var inputEl;
        var inputName;
        var inputNgEl;
        var options;
        var showSuccess;
        var initCheck = false;
        var showValidationMessages = false;

        options = scope.$eval(attrs.showErrors) || {};
        showSuccess = options.showSuccess || false;
        inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
        inputNgEl = angular.element(inputEl);
        inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

        if (!inputName) {
          throw new Error('show-errors element has no child input elements with a \'name\' attribute class');
        }

        scope.$watch(function () {
          return formCtrl[inputName] && formCtrl[inputName].$invalid;
        }, toggleClasses);

        scope.$on('show-errors-check-validity', checkValidity);
        scope.$on('show-errors-reset', reset);

        function checkValidity(event, name) {
          if (angular.isUndefined(name) || formCtrl.$name === name) {
            initCheck = true;
            showValidationMessages = true;

            return toggleClasses(formCtrl[inputName].$invalid);
          }
        }

        function reset(event, name) {
          if (angular.isUndefined(name) || formCtrl.$name === name) {
            return $timeout(function () {
              el.removeClass('has-error');
              el.removeClass('has-success');
            }, 0, false);
          }
        }

        function toggleClasses(invalid) {
          el.toggleClasses('has-error', showValidationMessages && invalid);

          if (showSuccess) {
            return el.toggleClasses('has-success', showValidationMessages && !invalid);
          }
        }
      }
    }
  }
}());
