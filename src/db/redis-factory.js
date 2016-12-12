const redis = require('redis');
const REDIS = require('../constants').REDIS;

/**
 * [redisFactory description]
 * @return {[type]} [description]
 */
function redisFactory() {
  return redis.createClient({
    port: REDIS.PORT,
    host: REDIS.HOST,
  });
}

module.exports = redisFactory;
