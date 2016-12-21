/**
 * Created by SamS@ne on 20/11/2016.
 */
(function () {
  'use strict';

  angular
    .module('users')
    .directive('passwordStrengthIndicator', passwordStrengthIndicator);

  passwordStrengthIndicator.$inject = [];

  function passwordStrengthIndicator() {
    var directive = {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        ngModel: '='
      },
      template: '<span id="password-strength-indicator"><span></span><span></span><span></span><span></span><md-tooltip md-direction="bottom">Force du password</md-tooltip></span>',
      link: linkFunction
    };

    return directive;

    function linkFunction(scope, element, attrs, ngModel) {
      var strength = {
        measureStrength: function (p) {
          var _passedMatches = 0;
          var _regex = /[$@&+#-/:-?{-~!"^_`\[\]]/g;
          if (/[a-z]+/.test(p)) {
            _passedMatches += 1;
          }
          if (/[A-Z]+/.test(p)) {
            _passedMatches += 1;
          }
          if (/[0-9]+/.test(p)) {
            _passedMatches += 1;
          }
          if (_regex.test(p)) {
            _passedMatches += 1;
          }
          return _passedMatches;
        }
      };

      var indicator = element.children();
      var dots = Array.prototype.slice.call(indicator.children());
      var weakest = dots.slice(-1)[0];
      var weak = dots.slice(-2);
      var strong = dots.slice(-3);
      var strongest = dots.slice(-4);

      element.after(indicator);

      var listener = scope.$watch('ngModel', function (newValue) {
        angular.forEach(dots, function (el) {
          el.style.backgroundColor = '#EDF0F3';
        });
        if (ngModel.$modelValue) {
          var c = strength.measureStrength(ngModel.$modelValue);
          console.log(ngModel.$modelValue.length);
          if (ngModel.$modelValue.length > 10 && c > 2) {
            angular.forEach(strongest, function (el) {
              el.style.backgroundColor = '#673AB7';
            });
          } else if (ngModel.$modelValue.length > 8 && c > 1) {
            angular.forEach(strong, function (el) {
              el.style.backgroundColor = '#CDDC39';
            });
          } else if (ngModel.$modelValue.length > 5 && c > 1) {
            angular.forEach(weak, function (el) {
              el.style.backgroundColor = '#FF9800';
            });
          } else {
            weakest.style.backgroundColor = '#E91E63';
          }
        }
      });

      scope.$on('$destroy', function () {
        return listener();
      });
    }
  }
}());
