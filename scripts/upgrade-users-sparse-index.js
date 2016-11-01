/**
 * Created by SamS@ne on 01/11/2016.
 */
'use strict';

// Set the NODE env
process.env.NODE_ENV = 'development';

/**
 * Module dependencies
 */
var chalk = require('chalk');
var mongoose = require('../config/lib/mongoose');

mongoose.loadModels();

var _indexToRemove = 'email_1',
  errors = [],
  processedCount = 0;

mongoose.connect(function (db) {
  // Get a reference to the User collection
  var userCollection = db.connections[0].collections.users;

  console.log();
  console.log(chalk.yellow('Suppression de l\'index "' + _indexToRemove + '" de la collection User.'));
  console.log();

  // Remove the index
  userCollection.dropIndex(_indexToRemove, function (err, result) {
    var message = 'Suppression de l\'index avec succès "' + _indexToRemove + '".';

    if (err) {
      errors.push(err);
      message = 'Une erreur est survenue pendant la suppression de l\'index "' + _indexToRemove + '".';

      if (err.message.indexOf('index not found with name') !== -1) {
        message = 'L\'index "' + _indexToRemove + '" n\'a pas été trouvé.' + '\r\nMerci de vérifier le nom de l\'index dans votre ' + 'mongodb User collection.';
      }

      reportAndExit(message);
    } else {
      reportAndExit(message);
    }
  });
});

function reportAndExit(message) {
  if (errors.length) {
    console.log(chalk.red(message));
    console.log();

    console.log(chalk.yellow('Erreurs: '));
    for (var i = 0; i < errors.length; i++) {
      console.log(chalk.red(errors[i]));

      if (i === (errors.length - 1)) {
        process.exit(0);
      }
    }
  } else {
    console.log(chalk.green(message));
    console.log(chalk.green('Au prochain démarrage de l\'application, ' + 'Mongoose reconstruira l\'index "' + _indexToRemove + '".'));
    process.exit(0);
  }
}
