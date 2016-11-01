/**
 * Created by SamS@ne on 01/11/2016.
 */

'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke admin permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/users',
      permissions: '*'
    }, {
      resources: '/api/users/:userId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check if admin policy is allowed
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occured
      return res.status(500).send('Erreur: droits insuffisants');
    } else {
      if (isAllowed) {
        // Access granted. Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'L\'utilisateur n\'est pas autorisé'
        });
      }
    }
  });
};
