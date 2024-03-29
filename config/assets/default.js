/**
 * Created by SamS@ne on 30/10/2016.
 */

'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        // bower: CSS
        'public/lib/angular-material/angular-material.css'
        // endbower: CSS
      ],
      js: [
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-aria/angular-aria.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-material/angular-material.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.js',
        'public/lib/angular-recaptcha/release/angular-recaptcha.js',
        // 'public/lib/angular-google-maps/dist/angular-google-maps.js',
        'public/lib/angular-scroll/angular-scroll.js',
        'public/lib/ng-file-upload/ng-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js'
      ]
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: ['modules/*/server/models/**/*.js'],
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    config: ['modules/*/server/config/*.js'],
    policies: ['modules/*/server/policies/*.js'],
    views: ['modules/*/server/views/*.html']
  }
};
