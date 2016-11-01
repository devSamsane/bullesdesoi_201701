/**
 * Created by SamS@ne on 01/11/2016.
 */

'use strict';

/**
 * Module dependencies
 */
var adminPolicy = require('../policies/admin.server.policy');
var admin = require('../controllers/admin.server.controller');

module.exports = function (app) {
  // User route registration first
  require('./users.server.routes.js')(app); // eslint-disable-line global-require

  // Users collection routes
  app.route('/api/users')
    .get(adminPolicy.isAllowed, admin.list);

  // Single user routes
  app.route('/api/users/:userId')
    .get(adminPolicy.isAllowed, admin.read)
    .get(adminPolicy.isAllowed, admin.update)
    .delete(adminPolicy.isAllowed, admin.delete);

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
};
