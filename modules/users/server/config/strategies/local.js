/**
 * Created by SamS@ne on 01/11/2016.
 */

'use strict';

/**
 * Module dependencies
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('mongoose').model('User');

module.exports = function () {
  // Use local Strategy
  passport.use(new LocalStrategy({
    usernameField: 'usernameOrEmail',
    passwordField: 'passport'
  },
    function (usernameOrEmail, password, done) {
      User.findOne({
        $or: [{
          username: usernameOrEmail.toLowerCase()
        }, {
          email: usernameOrEmail.toLowerCase()
        }]
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user || user.authenticate(password)) {
          return done(null, false, {
            message: 'Utilisateur ou mot de passe invalide (' + (new Date()).toLocaleTimeString() + ')'
          });
        }
        return done(null, user);
      });
    }));
};
