/**
 * Created by SamS@ne on 01/11/2016.
 */

'use strict';

module.exports = function (app) {
  // User routes
  var users = require('../controllers/users.server.controller'); // eslint-disable-line global-require

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/account').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
