const utils = require('./utils');
const appLogger = require('../loggers/app-logger');
const redisLogger = require('../loggers/redis-logger');
const CHANNEL = require('../constants').CHANNEL;

/**
 * Poller class
 */
class Poller {
  /**
   * [constructor description]
   */
  constructor() {
    this.client = require('../db/redis-factory')();
    this.pauser = utils.pauser_;
    this.statefulPoller = utils.statefulPoller_;
  }
  /**
   * Subscribe to main streams and pub data
   * @param  {Function} clbk callback to statefulPoller
   */
  start(clbk = null) {
    appLogger.debug('Poller started');
    this.subscription = this.statefulPoller.subscribe(clbk);
    this.client.on('message', this._onMessage.bind(this));
    this.client.subscribe(CHANNEL.HAS_USERS);
  }

  /**
   * Unsubscribe from poller updates
   * and redis db
   */
  stop() {
    this.pauser.next(false);
    this.subscription.unsubscribe();
    this.client.end(true);
  }

  /**
   * [_onMessage description]
   * @param  {[type]} channel [description]
   * @param  {[type]} message [description]
   */
  _onMessage(channel, message) {
    redisLogger.info('received message on ' + channel + ': ' + message);
    if (channel === CHANNEL.HAS_USERS) {
        try {
          // eslint-disable-next-line no-var
          var turnOn = JSON.parse(message);
        } catch(e) {
          redisLog('parsing error:\n%o', e);
          turnOn = true;
        }
        this.pauser.next(turnOn);
    }
  }
}

module.exports = new Poller();
