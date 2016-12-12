const debug = require('debug');

/**
 * Application logger
 */
function AppLogger() {
  this.info = debug('app-info');
  this.error = debug('app-error');
  this.debug = debug('app-debug');
}

module.exports = new AppLogger();
