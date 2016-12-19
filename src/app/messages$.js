const Rx = require('rxjs');
const CHANNEL = require('../constants').CHANNEL;
const appLogger = require('../loggers/app-logger');
const redisLogger = require('../loggers/redis-logger');
const redisFactory = require('../db/redis-factory');

const messages$ = Rx.Observable.create(function(observer) {
  const client = redisFactory();

  client.on('message', (channel, message) => {
    redisLogger.info('received message on ' + channel + ': ' + message);

    if (channel === CHANNEL.HAS_USERS) {
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
    }
  });

  client.subscribe(CHANNEL.HAS_USERS);

  return () => {
    client.unsubscribe();
    client.quit();
  };
});

module.exports = messages$;
