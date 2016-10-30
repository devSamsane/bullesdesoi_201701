/**
 * Created by SamS@ne on 30/10/2016.
 */

'use strict';

/**
 * Modules dependencies
 */
var _ = require('lodash');
var chalk = require('chalk');
var glob = require('glob');
var fs = require('fs');
var path = require('path');

/**
 * Get files by glob pattern
 */
var getGlobbedPaths = function (globPatterns, excludes) {
  // url paths regex
  var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // The output array
  var output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      var files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map(function (file) {
          if (_.isArray(excludes)) {
            for (var i in excludes) {
              if (excludes.hasOwnProperty(i)) {
                file = file.replace(excludes[i], '');
              }
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }
  return output;
};

/**
 * Validate NODE_ENV existence
 */
var validateEnvironmentVariable = function () {
  var environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');
  console.log();
  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      console.error(chalk.red('+ Erreur: Aucun fichier de configuration n\'a été trouvé pour "' + process.env.NODE_ENV + '" l\'environnement. Utilisation de l\'env. de developpement'));
    } else {
      console.error(chalk.red('+ Erreur: NODE_ENV n\'est pas definie. Utilisation de l\'environnement de développement par défaut'));
    }
    process.env.NODE_ENV = 'development';
  }
  // Reset console color
  console.log(chalk.white(''));
};

/**
 * Validate config.domain is set
 */
var validateDomainIsSet = function (config) {
  if (!config.domain) {
    console.log(chalk.red('+ Alerte:  config.domain n\'est pas renseignée. Elle devrait être paramétrée sur le nom de domaine de l\'application'));
  }
};

/**
 * Validate secure = true parameter can actually be turned on because it requires certs and key files to be available
 */
var validateSecureMode = function (config) {
  if (!config.secure || config.secure.ssl !== true) {
    return true;
  }

  var privateKey = fs.existsSync(path.resolve(config.secure.privateKey));
  var certificate = fs.existsSync(path.resolve(config.certificate));

  if (!privateKey || !certificate) {
    console.log(chalk.red('+ Erreur: Les fichiers certificats ou clés sont manquants, retour à un état non-ssl'));
    console.log(chalk.red(' Pour les créer, executer simplement les scripts suivants: sh ./scripts/generate-ssl-certs.sh'));
    console.log();
    config.secure.ssl = false;
  }
};

/**
 * Validate session secret parameter is not set to default in production
 */
var validateSessionSecret = function (config, testing) {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }
  if (config.sessionSecret === 'MEAN') {
    if (!testing) {
      console.log(chalk.red('+ ALERTE: Il est fortement recommandé de modifier le paramètre sessionSecret en production'));
      console.log(chalk.red('  Ajoutez `sessionSecret: process.env.SESSION_SECRET || \'super secret\'` à '));
      console.log(chalk.red('  `config/env/production.js` ou `config/env/local.js`'));
      console.log();
    }
    return false;
  } else {
    return true;
  }
};

/**
 * Intitialize global configuration files
 */
var initGlobalConfigFolders = function (config, assets) {
  // Appending folders
  config.folders = {
    server: {},
    client: {}
  };

  // Setting globbed client paths
  config.folders.client = getGlobbedPaths(path.join(process.cwd(), 'modules/*/client'), process.cwd().replace(new RegExp(/\\/g), '/'));
};

/**
 * Initialize global configuration files
 */
var initGlobalConfigFiles = function (config, assets) {
  // Appending files
  config.files = {
    server: {},
    client: {}
  };

  // Setting globbed model files
  config.files.server.models = getGlobbedPaths(assets.server.models);

  // Setting globbed route files
  config.files.server.routes = getGlobbedPaths(assets.server.routes);

  // Setting globbed config files
  config.files.server.configs = getGlobbedPaths(assets.server.config);

  // Setting globbed policies files
  config.files.server.policies = getGlobbedPaths(assets.server.policies);

  // Setting globbed js files
  config.files.client.js = getGlobbedPaths(assets.client.lib.js, 'public/').concat(getGlobbedPaths(assets.client.js, ['public/']));

  // Setting globbed css files
  config.files.client.css = getGlobbedPaths(assets.client.lib.css, 'public/').concat(getGlobbedPaths(assets.client.css, ['public/']));

  // Setting globbed test files
  // config.files.client.tests = getGlobbedPaths(assets.client.tests);
};

/**
 * Initialize global configuration
 */
var initGlobalConfig = function () {
  // Validate NODE_ENV existence
  validateEnvironmentVariable();

  // Get the default assets
  var defaultAssets = require(path.join(process.cwd(), 'config/assets/default')); // eslint-disable-line global-require

  // Get the current assets
  var environmentAssets = require(path.join(process.cwd(), 'config/assets/', process.env.NODE_ENV)) || {}; // eslint-disable-line global-require

  // Merge assets
  var assets = _.merge(defaultAssets, environmentAssets);

  // Get the default config
  var defaultConfig = require(path.join(process.cwd(), 'config/env/default')); // eslint-disable-line global-require

  // Get the current config
  var environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {}; // eslint-disable-line global-require

  // Merge config files
  var config = _.merge(defaultConfig, environmentConfig);

  // Read package.json for bullesdesoi project information
  var pkg = require(path.resolve('./package.json')); // eslint-disable-line global-require
  config.bullesdesoi = pkg;

  // Extend the config object with the local-NODE_ENV.js custom/local environment. This will override any settings present in the local configuration
  config = _.merge(config, (fs.existsSync(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js')) && require(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js'))) || {}); // eslint-disable-line global-require

  // Initialize global globbed files
  initGlobalConfigFiles(config, assets);

  // Initialize global globbed folders
  initGlobalConfigFolders(config, assets);

  // Validate secure ssl mode can be used
  validateSecureMode(config);

  // Validate session secret
  validateSessionSecret(config);

  // Print a warning if config.domain is not set
  validateDomainIsSet(config);

  // Expose configuration utilities
  config.utils = {
    getGlobbedPaths: getGlobbedPaths,
    validateSessionSecret: validateSessionSecret
  };

  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
