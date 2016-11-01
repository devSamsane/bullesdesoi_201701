/**
 * Created by SamS@ne on 01/11/2016.
 */

'use strict';

/**
 * Module dependencies
 */
var path = require('path');
var config = require(path.resolve('./config/config'));
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var mongoose = require('mongoose');
var User = mongoose.model('User');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Reset password: FORGOT method POST
 */
exports.forgot = function (req, res, next) {
  async.waterfall([

    // Generate random token
    function (done) {
      crypto.randomBytes(48, function (err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },

    // Lookup user by username
    function (token, done) {
      if (req.body.username) {
        User.findOne({
          username: req.body.username.toLowerCase()
        }, '-salt -password', function (err, user) {
          if (err || !user) {

            return res.status(400).send({
              message: 'Aucun compte n\'a été trouvé'
            });
          } else if (user.provider !== 'local') {
            return res.status(400).send({
              message: 'Un compte est enregistré avec le fournisseur d\'identité suivant : ' + user.provider
            });
          } else {
            user.resetPasswordToken = token;
            // Token valid for 1 hour
            user.resetPasswordExpires = Date.now() + 3600000;

            user.save(function (err) {
              done(err, token, user);
            });
          }
        });
      } else {

        return res.status(422).send({
          message: 'Le nom d\'utilisateur doit être renseigné'
        });
      }
    },
    function (token, user, done) {
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
      res.render(path.resolve('modules/users/server/templates/reset-password-email'), {
        name: user.displayName,
        appName: config.app.title,
        url: baseUrl + '/api/auth/reset' + token
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If email is valid, send a reset mail using the service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Réinitialisation du mot de passe',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({
            message: 'Un email vous a été envoyé avec la procédure à suivre'
          });
        } else {

          return res.status(400).send({
            message: 'Echec de l\'envoi du mail'
          });
        }

        done(err);
      });
    }
  ], function (err) {
    if (err) {

      return next(err);
    }
  });
};

/**
 * Reset password: GET from email token
 */
exports.validateResetToken = function (req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    if (err || !user) {
      return res.redirect('/password/reset/invalid');
    }
    res.redirect('/password/reset/' + req.params.token);
  });
};

/**
 * Reset password: POST from email token
 */
exports.reset = function (req, res, next) {
  var passwordDetails = req.body;

  async.waterfall([

    function (done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function (err, user) {
        if (!err && user) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            user.password = passwordDetails.newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function (err) {
              if (err) {
                return res.status(422).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                req.login(user, function (err) {
                  if (err) {
                    res.status(400).send(err);
                  } else {
                    // Remonve sensitive data before return authenticated user
                    user.password = undefined;
                    user.salt = undefined;

                    res.json(user);

                    done(err, user);
                  }
                });
              }
            });
          } else {

            return res.status(422).send({
              message: 'Les mots de passe ne correspondent pas'
            });
          }
        } else {

          return res.status(400).send({
            message: 'Le token de réinitialisation du mot de passe est invalide'
          });
        }
      });
    },
    function (user, done) {
      res.render('modules/users/server/templates/reset-password-confirm-email', {
        name: user.displayName,
        appName: config.app.title
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If email is valid, send a reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Votre mote de passe a été changé',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, function (err) {
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Change password
 */
exports.changePassword = function (req, res, next) {
  var passwordDetails = req.body;

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, function (err, user) {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword;

              user.save(function (err) {
                if (err) {
                  return res.status(422).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  req.login(user, function (err) {
                    if (err) {
                      res.status(400).send(err);
                    } else {
                      res.send({
                        message: 'Le mot de passe a été changé avec succés'
                      });
                    }
                  });
                }
              });
            } else {
              res.status(422).send({
                message: 'Les mots de passe ne correspondent pas'
              });
            }
          } else {
            res.status(422).send({
              message: 'Le mot de passe actuel est incorrect'
            });
          }
        } else {
          res.status(400).send({
            message: 'L\'utilisateur n\'a pas été trouvé'
          });
        }
      });
    } else {
      res.status(422).send({
        message: 'Merci de saisir un nouveau mot de passe'
      });
    }
  } else {
    res.status(401).send({
      message: 'L\'utilisateur n\'est pas authentifié'
    });
  }
};
