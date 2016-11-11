/**
 * Created by SamS@ne on 30/10/2016.
 */

'use strict';

/**
 * Module dependencies
 */
var defaultEnvConfig = require('./default');

/**
 * Initialize environment
 */
module.exports = {
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/dev-bullesdesoi',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debub mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // Logging with Morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '768552639951695',
    clientSecret: process.env.FACEBOOK_SECRET || '37947b14889e39f5ed24b774dd0c0af5',
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    username: 'Sam_sane',
    clientID: process.env.TWITTER_KEY || '57nhCS84GR44DkWZFKmTq8JKV',
    clientSecret: process.env.TWITTER_SECRET || 'dEQiWlB8D5JoqAdrkH7rA0dxwV4kNeGI8XUCKUfj0aGwGMwpKt',
    callbackURL: '/api/auth/twitter/callback' // Il est nécessaire de configurer callbackURL dans la configuration de l'application sur twitter
  },
  google: {
    clientID: process.env.GOOGLE_ID || '200872704306-gvnfo6ad60fqjo8nii34npr551fa6pc6.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'KGN6xGb2C67Gtq4IEEM8m6B8',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: true
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  },
  livereload: true,
  seedDB: {
    seed: process.env.MONGO_SEED === 'true',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false',
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'seeduser',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'seedadmin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      }
    }
  }
};
