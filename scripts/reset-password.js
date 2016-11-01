'use strict';

/**
 * Module dependencies
 */
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var chalk = require('chalk');
var config = require('../config/config');
var mg = require('../config/lib/mongoose');

var transporter = nodemailer.createTransport(config.mailer.options);
var link = 'reset link here'; // Put reset link here
var email = {
  from: config.mailer.from,
  subject: 'Mise à jour de sécurité'
};
var text = [
  'Cher/Chère {{name}},',
  '\n',
  'Nous avons mis à jour notre politique de mot de passe pour une meilleure protection de vos données, merci de cliquer sur le lien pour réinitialiser votre mot de passe.',
  link,
  '\n',
  'Merci,',
  'L\'équipe Bulles de soi'
].join('\n');

mg.loadModels();

mg.connect(function (db) {
  var User = mongoose.model('User');

  User.find().exec(function (err, users) {
    if (err) {
      throw err;
    }
    var processedCount = 0,
      errorCount = 0;

    // Report and exit if no users were found
    if (users.length === 0) {
      return reportAndExit(processedCount, errorCount);
    }

    for (var i = 0; i < users.length; i++) {
      sendEmail(users[i]);
    }

    function sendEmail(user) {
      email.to = user.email;
      email.text = email.html = text.replace('{{name}}', user.displayName);

      transporter.sendMail(email, emailCallback(user));

    }

    function emailCallback(user) {
      return function (err, info) {
        processedCount++;

        if (err) {
          errorCount++;

          if (config.mailer.options.debug) {
            console.log('Error', err);
          }
          console.log('[' + processedCount + '/' + users.length + ']' + chalk.red('Envoi email impossiple pour ' + user.displayName));
        } else {
          console.log('[' + processedCount + '/' + users.length + '] Envoi du mail de réinitialisation du mot de passe pour ' + user.displayName);
        }
        if (processedCount === users.length) {
          return reportAndExit(processedCount, errorCount);
        }
      };
    }

    // Report the processing results and exit
    function reportAndExit(processedCount, errorCount) {
      var successCount = processedCount - errorCount;

      console.log();

      if (processedCount === 0) {
        console.log(chalk.yellow('Aucun utilisateur de trouvé'));
      } else {
        var alert;
        if (!errorCount) {
          alert = chalk.green;
        } else if ((successCount / processedCount) < 0.8) {
          alert = chalk.red;
        } else {
          alert = chalk.yellow;
        }

        console.log(alert('Envoi ' + successCount + ' sur ' + processedCount + ' d\'emails avec succès'));
      }

      process.exit(0);
    }
  });
});
