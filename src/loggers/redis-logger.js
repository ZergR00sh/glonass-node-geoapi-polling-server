const debug = require('debug');

/**
 * Redis Access logger
 */
function RedisLogger() {
  this.info = debug('redis-info');
  this.error = debug('redis-error');
  this.debug = debug('redis-debug');
}

module.exports = new RedisLogger();
