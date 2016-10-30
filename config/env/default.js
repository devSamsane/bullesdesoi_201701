/**
 * Created by SamS@ne on 30/10/2016.
 */

'use strict';

module.exports = {
  app: {
    title: 'Bulles de Soi',
    description: 'Web application about sophrologie',
    keywords: 'sophrologie, bien-être, enfance, adolescence, périnatalité, confiance, soi, maitriser, émotions',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  db: {
    promise: global.Promise
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'O.O.O.O',
  // DOMAIN config should be set to the fully qualified application accessible URL
  // Example: https://www.myapp.com (including port if required)
  domain: process.env.DOMAIN,
  // Session cookie settings
  sessionCookie: {
    // Session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed through the HTTP protocol and not JS/Browser
    httpOnly: true,
    // Secure cookie should be turned to true to provide additional layer of security so that the cookie is set only when working in HTTPS mode
    secure: false
  },
  // Session secret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'HXN1x30DCQ0r3uzjnQ2tGNzspfn8wF',
  // Session key is the cookie session name
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',

  // Lusca configuration
  csrf: {
    csrf: false,
    csp: false,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },

  logo: 'modules/core/client/img/brand/logo-500.png',
  favicon: 'modules/core/client/img/brand/favicon.ico',
  illegalUsernames: ['meanjs', 'administrator', 'administrateur', 'password', 'admin', 'user', 'unknown', 'anonymous', 'null', 'undefined', 'api'],
  uploads: {
    profile: {
      dest: './modules/users/client/img/profile/uploads',
      limits: {
        fileSize: 1 * 1024 * 1024
      }
    }
  },
  shared: {
    owasp: {
      allowPassphrases: true,
      maxLength: 128,
      minLength: 10,
      minPhraseLength: 20,
      minOptionalTestsToPass: 4
    }
  }
};
