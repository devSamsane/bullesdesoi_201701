/**
 * Created by SamS@ne on 01/11/2016.
 */

'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'L\'utilisateur n\'est pas valide'
    });
  }

  User.findOne({
    _id: id
  }).exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Echec de chargement de l\'utilisateur ' + id));
    }

    req.profile = user;
    next();
  });
};
