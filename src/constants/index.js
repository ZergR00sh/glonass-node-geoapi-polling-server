const API_KEY = process.env.API_KEY || 'API_KEY_NON_CORRECT';
const API_BASE = process.env.API_BASE || 'http://release.fire-group.com';

const HAS_USERS_CHANNEL = process.env.REDIS_GEOAPI_POLL || 'HAS_USERS_CHANNEL';
const GEO_STATE_CHANNEL = process.env.GEO_STATE_CHANNEL || 'GEO_STATE_CHANNEL';

const REDIS_HOST = process.env.REDIS_HOST || 'redis.db';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 500;

module.exports = {
  API: {
    KEY: API_KEY,
    BASE: API_BASE,
    POLLING_INTERVAL,
  },
  REDIS: {
    HOST: REDIS_HOST,
    PORT: REDIS_PORT,
  },
  CHANNEL: {
    HAS_USERS: HAS_USERS_CHANNEL,
    GEO_STATE: GEO_STATE_CHANNEL,
  },
};
