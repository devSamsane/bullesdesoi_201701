/**
 * Created by SamS@ne on 30/10/2016.
 */

'use strict';

/**
 * Module dependencies
 */
var config = require('../config');
var chalk = require('chalk');
var path = require('path');
var mongoose = require('mongoose');

// Load the mongoose models
module.exports.loadModels = function (callback) {
  // Globbing model files
  config.files.server.models.forEach(function (modelPath) {
    require(path.resolve(modelPath)); // eslint-disable-line global-require
  });
  if (callback) callback();
};

/**
 * Initialize mongoose
 */
module.exports.connect = function (cb) {
  var _this = this;
  var db = mongoose.connect(config.db.uri, config.db.options, function (err) {
    // Log error
    if (err) {
      console.error(chalk.red('Impossible de se connecter à la base MongoDB'));
      console.log(err);
    } else {
      mongoose.Promise = config.db.promise;

      // Enabling mongoose debug mode if required
      mongoose.set('debug', config.db.debug);

      // Call callback FN
      if (cb) cb(db);
    }
  });
};

module.exports.disconnect = function (cb) {
  mongoose.disconnect(function (err) {
    console.info(chalk.yellow('Déconnecté de MongoDB'));
    cb(err);
  });
};
