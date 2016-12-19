const appLogger = require('../loggers/app-logger');
const redisFactory = require('../db/redis-factory');
const devicesState$ = require('./devices-state$');

/**
 * Publisher class
 */
class DevicesPublisher {
  /**
   * Constructor
   * @param  {String} channel channel to subscribe
   */
  constructor(channel) {
    this.publisher = redisFactory();
    this.channel = channel;
    this.publish = this.publish.bind(this);
  }
  /**
   * Subscribe to main streams and pub data
   */
  start() {
    appLogger.info('Publisher started!');
    this.subscription = devicesState$.subscribe(this.publish);
  }
  /**
   * Publish devices to redis channel
   * @param  {Object} devices devices with geolocation
   */
  publish(devices) {
    this.publisher.publish(this.channel, JSON.stringify(devices));
  }
  /**
   * Unsubscribe from publisher updates
   * and redis db
   */
  stop() {
    appLogger.info('Publisher stoped!');
    this.subscription.unsubscribe();
    this.publisher.quit();
  }
}

module.exports = DevicesPublisher;
