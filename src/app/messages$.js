const Rx = require('rxjs');
const CHANNEL = require('../constants').CHANNEL;
const appLogger = require('../loggers/app-logger');
const redisLogger = require('../loggers/redis-logger');
const redisFactory = require('../db/redis-factory');

const messages$ = Rx.Observable.create(function(observer) {
  const subscriber = redisFactory();

  subscriber.on('message', (channel, message) => {
    redisLogger.info('received message on ' + channel + ': ' + message);
    switch(message) {
      case CHANNEL.MSGS.FIRST_USER_ARRIVED:
        observer.next(true);
        break;
      case CHANNEL.MSGS.LAST_USER_LEFT:
        observer.next(false);
        break;
      default:
        appLogger.debug('UNHENDLED_MESSAGE');
        observer.error(new Error('UNHENDLED_MESSAGE'));
    }
  });

  subscriber.subscribe(CHANNEL.HAS_USERS);

  return () => {
    subscriber.unsubscribe();
    subscriber.quit();
  };
});

module.exports = messages$;
