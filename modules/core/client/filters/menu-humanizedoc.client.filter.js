/**
 * Created by SamS@ne on 31/10/2016.
 */
(function () {
  'use strict';

  angular
    .module('core')
    .filter('humanizeDoc', function () {
      return function (doc) {
        if (!doc) return;
        if (doc.type === 'directive') {
          return doc.name.replace(/(A-Z)/g, function ($1) {
            return '-' + $1.toLowerCase();
          });
        }
        return doc.label || doc.name;
      };
    });
}());
