/**
 * Created by SamS@ne on 31/10/2016.
 */
(function () {
  'use strict';

  angular
    .module('core')
    .directive('menuLink', function () {
      return {
        scope: {
          section: '='
        },
        templateUrl: 'modules/core/client/views/templates/menu-link.client.tmpl.html',
        link: function ($scope, $element) {
          var controller = $element.parent().controller();

          $scope.isSelected = function () {

            return controller.isSelected($scope.section);
          };

          $scope.focusSection = function () {
            // set flag to be used later when $stateChangeSuccess call openPage()
            controller.autoFocusContent = true;
          };
        }
      };
    });
}());
