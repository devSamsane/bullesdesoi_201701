/**
 * Created by SamS@ne on 30/10/2016.
 */

'use strict';

/**
 * Modules dependencies
 */
var config = require('../config');
var mongoose = require('./mongoose');
var express = require('./express');
var chalk = require('chalk');
var seed = require('./seed');

function seedDB() {
  if (config.seedDB && config.seedDB.seed) {
    console.log(chalk.bold.red('Attention: Base de données seeding activée'));
    seed.start();
  }
}

// Initialize models
mongoose.loadModels(seedDB);

module.exports.init = function init(callback) {
  mongoose.connect(function (db) {
    // Initialize express
    var app = express.init(db);
    if (callback) callback(app, db, config);
  });
};

module.exports.start = function start(callback) {
  var _this = this;
  _this.init(function (app, db, config) {
    // Start the application listenning on <port> at <host>
    app.listen(config.port, config.host, function () {
      // Create server url
      var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
      // Logging intialization
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log();
      console.log(chalk.green('Environnement:   ' + process.env.NODE_ENV));
      console.log(chalk.green('Serveur:         ' + server));
      console.log(chalk.green('Database:        ' + config.db.uri));
      console.log(chalk.green('App version:     ' + config.bullesdesoi.version));
      if (config.bullesdesoi['bullesdesoi-version'])
        console.log(chalk.green('Bulles de Soi version : ' + config.bullesdesoi['Bulles de Soi - version']));
      console.log('--');

      if (callback) callback(app, db, config);
    });
  });
};
