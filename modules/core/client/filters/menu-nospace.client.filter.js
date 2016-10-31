/**
 * Created by SamS@ne on 31/10/2016.
 */
(function () {
  'use strict';

  angular
    .module('core')
    .filter('nospace', function () {
      return function (value) {
        return (!value) ? '' : value.replace(/ /g, '');
      };
    });
}());
