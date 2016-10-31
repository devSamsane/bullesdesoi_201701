/**
 * Created by SamS@ne on 31/10/2016.
 */
(function () {
  'use strict';

  angular
    .module('core')
    .factory('menuSidenav', menuSidenav);

  menuSidenav.$inject = ['$location', '$rootScope', '$window', '$state'];

  function menuSidenav($location, $rootScope, $window, $state) {
    var sections = [];

    sections.push({
      name: 'Sophrologie',
      type: 'heading',
      id: 'sophrologie',
      children: [
        {
          name: 'Description',
          state: 'sophrologie',
          type: 'link'
        },
        {
          name: 'Applications',
          type: 'toggle',
          pages: [
            {
              name: 'Périnatalité',
              state: 'perinatalite',
              type: 'link'
            },
            {
              name: 'Enfance',
              state: 'enfance',
              type: 'link'
            },
            {
              name: 'Adolescence',
              state: 'adolescence',
              type: 'link'
            },
            {
              name: 'Adulte',
              state: 'adulte',
              type: 'link'
            },
            {
              name: 'Senior',
              state: 'senior',
              type: 'link'
            }
          ]
        }
      ]
    });
    sections.push({
      name: 'Votre sophrologue',
      type: 'heading',
      id: 'about me',
      children: [
        {
          name: 'A mon propos',
          state: 'amonpropos',
          type: 'link'
        },
        {
          name: 'Code de déontologie',
          state: 'deontologie',
          type: 'link'
        }
      ]
    });
    sections.push({
      name: 'Espace client',
      type: 'heading',
      id: 'customer',
      children: [
        {
          name: 'Votre espace',
          type: 'toggle',
          pages: [
            {
              name: 'Créer votre espace',
              state: 'authentication.signup',
              type: 'link'
            },
            {
              name: 'Vous connecter',
              state: 'authentication.signin',
              type: 'link'
            }
          ]
        },
        {
          name: 'Prendre rendez-vous',
          state: 'rdv',
          type: 'link'
        }
      ]
    });
    sections.push({
      name: 'Informations pratiques',
      type: 'heading',
      id: 'informations',
      children: [
        {
          name: 'Me trouver',
          type: 'link',
          state: 'localisation'
        },
        {
          name: 'Description des séances',
          type: 'toggle',
          pages: [
            {
              name: 'Mes prestations',
              type: 'link',
              state: 'prestations'
            },
            {
              name: 'Tarifs',
              type: 'link',
              state: 'tarifs'
            }
          ]
        },
        {
          name: 'Approfondir la sophrologie',
          type: 'link',
          state: 'ensavoirplus'
        }
      ]
    });

    var self;
    $rootScope.$on('$stateChangeSuccess', onStateChange);
    return self = {
      sections: sections,

      selectSection: function (section) {
        self.openedSection = section;
        self.currentSection = section;
      },
      toggleSelectSection: function (section) {
        self.openedSection = (self.openedSection === section ? null : section);
      },
      isSectionSelected: function (section) {
        return self.openedSection === section;
      },
      selectPage: function (section, page) {
        self.currentSection = section;
        self.currentPage = page;
      },
      isPageSelected: function (page) {
        return self.currentPage === page;
      }
    };

    function onStateChange() {
      var currentState = $state.current.name;
      // var homePage = {
      //   name: 'Accueil',
      //   state: 'home',
      //   type: 'link'
      // };

      if (currentState === 'home') {
        self.selectSection('');
        self.selectPage('', '');
        return;
      }

      var matchPage = function (section, page) {
        if (currentState.indexOf(page.state) !== -1) {
          self.selectSection(section);
          self.selectPage(section, page);
        }
      };

      sections.forEach(function (section) {
        if (section.children) {
          // Matches nested section toggles
          section.children.forEach(function (childSection) {
            if (childSection.pages) {
              childSection.pages.forEach(function (page) {
                matchPage(childSection, page);
              });
            } else if (childSection.type === 'link') {
              matchPage(childSection, childSection);
            }
          });
        } else if (section.pages) {
          // Matches top-level section toggles
          section.pages.forEach(function (page) {
            matchPage(section, page);
          });
        } else if (section.type === 'link') {
          // Matches top-level links
          matchPage(section, section);
        }
      });
    }
  }
}());
