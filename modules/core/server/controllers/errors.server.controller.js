/**
 * Created by SamS@ne on 30/10/2016.
 */

'use strict';

/**
 * Module dependencies
 */
var path = require('path');
var config = require(path.resolve('./config/config'));

/**
 * Get the unique error field name
 */
var getUniqueErrorMessage = function (err) {
  var output;

  try {
    var begin = 0;
    if (err.errmsg.lastIndexOf('.$') !== -1) {
      // Support mongodb <= 3.0 (default: MMapv1 engine)
      // errmsg: "E11000 duplicate key error index: dev-bullesdesoi.users.$email_1 dup key: { : \"test@user.com\"}"
      begin = err.errmsg.lastIndexOf('.$') + 2;
    } else {
      // Support mongodb >= 3.2 (default: WiredTiger engine)
      // errmsg: "E11000 duplicate key error collection: dev-bullesdesoi.users index: email_1 dup key: {\"test@user.com\" }"
      begin = err.errmsg.lastIndexOf('index: ') + 7;
    }
    var fieldName = err.errmsg.substring(begin, err.errmsg.lastIndexOf('_1'));
    output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' existe déjà';
  } catch (ex) {
    output = 'Le champ unique existe déjà';
  }

  return output;
};

/**
 * Get the error message from error object
 */
exports.getErrorMessage = function (err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getUniqueErrorMessage(err);
        break;
      case 'UNSUPPORTED_MEDIA_FILE':
        message = 'Type de fichier non supporté';
        break;
      case 'LIMIT_FILE_SIZE':
        message = 'Image trop grande. La taille maximum autorisée est ' + (config.uploads.profile.limits.fileSize / (1024 * 1024)).toFixed(2) + ' Mb';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Il manque le champ `newProfilePicture`';
        break;
      default:
        message = 'Une erreur est survenue';
    }
  } else if (err.message && !err.errors) {
    message = err.message;
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) {
        message = err.errors[errName].message;
      }
    }
  }

  return message;
};
