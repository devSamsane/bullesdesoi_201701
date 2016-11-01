/**
 * Created by SamS@ne on 01/11/2016.
 */
(function () {
  'use strict';

  // Users directive used to force lowercase input
  angular
    .module('users')
    .directive('lowercase', lowercase);

  function lowercase() {
    var directive = {
      require: 'ngModel',
      link: link
    };

    return directive;

    function link(scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {

        return input ? input.tolowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  }
}());
