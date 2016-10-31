/**
 * Created by SamS@ne on 30/10/2016.
 */

'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller'); // eslint-disable-line global-require

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, modules or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);
};
