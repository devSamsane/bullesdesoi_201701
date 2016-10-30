/**
 * Created by SamS@ne on 30/10/2016.
 */

'use strict';

module.exports.profileUploadFileFilter = function (req, file, callback) {
  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif') {

    var err = new Error();
    err.code = 'UNSUPPORTED_MEDIA_TYPE';

    return callback(err, false);
  }
  callback(null, true);
};
