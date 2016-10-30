/**
 * Created by SamS@ne on 30/10/2016.
 */

'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/angular-material/angular-material.min.css',
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/angular/angular.min.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-aria/angular-aria.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-material/angular-material.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min/js',
        'public/lib/angular-recaptcha/release/angular-recaptcha.min.js',
        // 'public/lib/angular-google-maps/dist/angular-google-maps.min.js',
        'public/lib/angular-scroll/angular-scroll.min.js',
        'public/lib/ng-file-upload/ng-file-upload.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js'
        // endbower
      ]
    },
    css: 'public/dist/application*.min.css',
    js: 'public/dist/application*.min.js'
  }
};
