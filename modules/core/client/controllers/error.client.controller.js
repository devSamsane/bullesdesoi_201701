/**
 * Created by SamS@ne on 31/10/2016.
 */
(function () {
  'use strict';

  angular
    .module('core')
    .controller('ErrorController', ErrorController);

  ErrorController.$inject = ['$stateParams'];

  function ErrorController($stateParams) {
    var vm = this;
    vm.errorMessage = null;

    // Display custom message
    if ($stateParams.message) vm.errorMessage = $stateParams.message;
  }
}());
