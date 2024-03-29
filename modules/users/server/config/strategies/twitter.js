/**
 * Created by SamS@ne on 01/11/2016.
 */

'use strict';

/**
 * Module dependencies
 */
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var users = require('../../controllers/users.server.controller');

module.exports = function (config) {
  // Use the twitter Strategy
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL,
    passReqToCallback: true
  },
    function (req, token, tokenSecret, profile, done) {
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.token = token;
      providerData.tokenSecret = tokenSecret;

      // Create the user OAuth profile
      var displayName = profile.displayName.trim();
      // Index of the whitespace following the firstname
      var iSpace = displayName.indexOf(' ');
      var firstName = iSpace !== -1 ? displayName.substring(0, iSpace) : displayName;
      var lastName = iSpace !== -1 ? displayName.substring(iSpace + 1) : '';

      var providerUserProfile = {
        firstName: firstName,
        lastName: lastName,
        displayName: displayName,
        username: profile.username,
        profileImageURL: profile.photos[0].value.replace('normal', 'bigger'),
        provider: 'twitter',
        providerIdentifierField: 'id_str',
        providerData: providerData
      };

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
};
