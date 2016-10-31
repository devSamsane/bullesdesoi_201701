/**
 * Created by SamS@ne on 31/10/2016.
 */
(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenu('account', {
      roles: ['user']
    });

    menuService.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Editer mon profil',
      state: 'settings.profile'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Modifier mon image',
      state: 'settings.picture'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Changer de mot de passe',
      state: 'settings.password'
    });

    // menuService.addSubMenuItem('account', 'settings', {
    //   title: 'Manage Social Accounts',
    //   state: 'settings.accounts'
    // });
  }
}());
