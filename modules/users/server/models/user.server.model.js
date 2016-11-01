/**
 * Created by SamS@ne on 01/11/2016.
 */

'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var path = require('path');
var config = require(path.resolve('./config/config'));
var Schema = mongoose.Schema;
var crypto = require('crypto');
var validator = require('validator');
var generatePassword = require('generate-password');
var owasp = require('owasp-password-strength-test');

owasp.config(config.shared.owasp);

/**
 * A validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {

  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, { require_tld: false }));
};

/**
 * A validation function for username
 * - at least 3 characters
 * - only a-z 0-9 _-.
 * - contain at least one alphanumeric character
 * - not in list of illegal usernames
 * - no consecutive dots: "." ok ".." nope
 * - not begin or end with "."
 */
var validateUsername = function (username) {
  var usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
  return (
    this.provider !== 'local' || (username && usernameRegex.test(username) && config.illegalUsernames.indexOf(username) < 0)
  );
};


/**
 * User Schema
 */
var UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Veuillez saisir votre prénom']
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Veuillez saisir votre nom']
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
    },
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
  },
  username: {
    type: String,
    unique: 'Username already exists',
    required: 'Please fill in a username',
    validate: [validateUsername, 'Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.'],
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    default: ''
  },
  salt: {
    type: String
  },
  profileImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerData: {},
  additionalProvidersData: {},
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin']
    }],
    default: ['user'],
    required: 'Please provide at least one role'
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(48).toString('base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

/**
 * Hook a pre validate method to test the local password
 */
UserSchema.pre('validate', function (next) {
  if (this.provider === 'local' && this.password && this.isModified('password')) {
    var result = owasp.test(this.password);
    if (result.errors.length) {
      var error = result.errors.join(' ');
      this.invalidate('password', error);
    }
  }
  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 512, 'SHA512').toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  var _this = this;
  var possibleUsername = username.toLowerCase() + (suffix || '');

  _this.findOne({
    username: possibleUsername
  }, function (err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

/**
 * Generate a random passphrase that passes the owasp test
 * Returns a promise that resolves with the genrated passphrase, or rejects with an error if something goes wrong
 * NOTE: passphrases are the only tested against the required owasp strength tests, and not the optional tests.
 */
UserSchema.statics.generateRandomPassphrase = function () {
  return new Promise(function (resolve, reject) {
    var password = '';
    var repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

    // Iterate until we have a valid passphrase
    // NOTE: Should rarely iterate more than once, but we need to ensure no repeating characters are present
    while (password.length < 20 || repeatingCharacters.test(password)) {
      // Built the random password between 20 and 40 characters
      password = generatePassword.generate({
        length: Math.floor(Math.random() * (20)) + 20,
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true
      });

      // Check if we need to remove any repeating characters
      password = password.replace(repeatingCharacters, '');
    }

    // Send the rejection back if the passphrase fails to pass the strength test
    if (owasp.test(password).errors.length) {
      reject(new Error('Une erreur est survenue lors de la génération de la passphrase'));
    } else {
      // Resolve with the validated passphrases
      resolve(password);
    }
  });
};

mongoose.model('User', UserSchema);
