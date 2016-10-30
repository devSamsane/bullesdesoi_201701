/**
 * Created by SamS@ne on 30/10/2016.
 */

'use strict';

var _ = require('lodash');
var config = require('../config');
var mongoose = require('mongoose');
var chalk = require('chalk');
var crypto = require('crypto');

// Global seed options object
var seedOptions = {};

function removeUser(user) {

  return new Promise(function (resolve, reject) {
    var User = mongoose.model('User');
    User.find({ username: user.username }).remove(function (err) {
      if (err) {
        reject(new Error('Echec de suppression de l\'utilisateur local ' + user.username));
      }
      resolve();
    });
  });
}

function saveUser(user) {

  return function() {
    return new Promise(function (resolve, reject) {
      // Then save the user
      user.save(function (err, theuser) {
        if (err) {
          reject(new Error('Echec d\'enregistrement de l\'utilisateur ' + user.username));
        } else {
          resolve(theuser);
        }
      });
    });
  };
}

function checkUserNoExists (user) {

  return new Promise(function (resolve, reject) {
    var User = mongoose.model('User');
    User.find({ username: user.username }, function (err, users) {
      if (err) {
        reject(new Error('Echec l\'utilisateur ' + user.username + 'n\'a pas été trouvé'));
      }
      if (users.length === 0) {
        resolve();
      } else {
        reject(new Error('Echec, l\'utilisateur ' + user.username + ' existe dejà en base'));
      }
    });
  });
}

function reportSuccess(password) {
  return function (user) {

    return new Promise(function (resolve, reject) {
      if (seedOptions.logResults) {
        console.log(chalk.bold.red('La base de données Seeding:\t\t\tlocal ' + user.username + ' a été ajoutée, password: ' + password));
      }
      resolve();
    });
  };
}

// Save the specified user with the password provided from the resolved promise
function seedTheUser(user) {
  return function (password) {

    return new Promise(function (resolve, reject) {
      var User = mongoose.model('User');

      // Set the new password
      user.password = password;

      if (user.username === seedOptions.seedAdmin.username && process.env.NODE_ENV === 'production') {
        checkUserNoExists(user)
          .then(saveUser(user))
          .then(reportSuccess(password))
          .then(function () {
            resolve();
          })
          .catch(function (err) {
            reject(err);
          });
      } else {
        removeUser(user)
          .then(saveUser(user))
          .then(reportSuccess(password))
          .then(function (err) {
            reject(err);
          });
      }
    });
  };
}

// Report the error
function reportError(reject) {

  return function (err) {
    if (seedOptions.logResults) {
      console.log();
      console.log('Base de données Seeding:\t\t\t' + err);
      console.log();
    }
    reject(err);
  };
}

module.exports.start = function start(options) {
  // Initialize the default seed options
  seedOptions = _.clone(config.seedDB.options, true);

  // Check for provided options
  if (_.has(options, 'logResults')) {
    seedOptions.logResults = options.logResults;
  }

  if (_.has(options, 'seedUser')) {
    seedOptions.seedUser = options.seedUser;
  }

  if (_.has(options, 'seedAdmin')) {
    seedOptions.seedAdmin = options.seedAdmin;
  }

  var User = mongoose.model('User');

  return new Promise(function (resolve, reject) {
    var adminAccount = new User(seedOptions.seedAdmin);
    var userAccount = new User(seedOptions.seedUser);

    // If production only seed admin if it does not exist
    if (process.env.NODE_ENV === 'production') {
      User.generateRandomPassphrase()
        .then(seedTheUser(adminAccount))
        .then(function () {
          resolve();
        })
        .catch(reportError(reject));
    } else {
      // Add both admin and user account
      User.generateRandomPassphrase()
        .then(seedTheUser(userAccount))
        .then(User.generateRandomPassphrase)
        .then(seedTheUser(adminAccount))
        .then(function () {
          resolve();
        })
        .catch(reportError(reject));
    }
  });
};
