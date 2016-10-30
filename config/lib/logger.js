/**
 * Created by SamS@ne on 30/10/2016.
 */

'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');
var config = require('../config');
var chalk = require('chalk');
var fs = require('fs');
var winston = require('winston');

// List of valid formats for the logging
var validFormats = ['combined', 'common', 'dev', 'short', 'tiny'];

// Instantiating the default winston application logger with the console transport
var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      colorize: true,
      showLevel: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    })
  ],
  exitOnError: false
});

// A stream new object with a write function that will call the built-in winston logger.info() function
// Usefull for integrating with stream-related mechanism like Morgan's stream option to log all HTTP requests to a file
logger.stream = {
  write: function(msg) {
    logger.info(msg);
  }
};

/**
 * Instantiate a winston's file transport for disk file logging
 */
logger.setupFileLogger = function setupFileLogger() {
  var fileLoggerTransport = this.getLogOptions();
  if (!fileLoggerTransport) {
    return false;
  }

  try {
    // Check first if the configured path is writable and only then instantiate the file logging transport
    if (fs.openSync(fileLoggerTransport.filename, 'a+')) {
      logger.add(winston.transports.File, fileLoggerTransport);
    }

    return true;
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.log();
      console.log(chalk.red('Une erreur est survenue pendant la création du fichier de logs'));
      console.log(chalk.red(err));
      console.log();
    }

    return false;
  }
};

/**
 * Configure the options to use winston logger
 * Returns a winston object for logging with File transport
 */
logger.getLogOptions = function getLogOptions() {
  var _config = _.clone(config, true);
  var configFileLogger = _config.log.fileLogger;

  if (!_.has(_config, 'log.fileLogger.directoryPath') || !_.has(_config, 'log.fileLogger.fileName')) {
    console.log('Impossible de trouver le fichier de configuration logging');

    return false;
  }

  var logPath = configFileLogger.directoryPath + '/' + configFileLogger.fileName;

  return {
    level: 'debug',
    colorize: false,
    filename: logPath,
    timestamp: true,
    maxsize: configFileLogger.maxsize ? configFileLogger.maxsize : 10485760,
    maxFiles: configFileLogger.maxFiles ? configFileLogger.maxFiles : 2,
    json: (_.has(configFileLogger, 'json')) ? configFileLogger.json : false,
    eol: '\n',
    tailable: true,
    showLevel: true,
    handleExceptions: true,
    humanReadableUnhandledException: true
  };
};

/**
 * Configure the options to use with morgan logger
 * Returns a log.options object with a writable stream based on winston file logging transport (if available)
 */
logger.getMorganOptions = function getMorganOptions() {

  return {
    stream: logger.stream
  };
};

/**
 * The format to use with the logger
 * Returns the log.format option set in the current environment configuration
 */
logger.getLogFormat = function getLogFormat() {
  var format = config.log && config.log.format ? config.log.format.toString() : 'combined';

  // Make sure we have a valid format
  if (!_.includes(validFormats, format)) {
    format = 'combined';

    if (process.env.NODE_ENV !== 'test') {
      console.log();
      console.log(chalk.yellow('Attention: Un format invalide est fourni. Le Logger doit utiliser le format "' + format + '"'));
      console.log();
    }
  }

  return format;
};

logger.setupFileLogger();

module.exports = logger;
