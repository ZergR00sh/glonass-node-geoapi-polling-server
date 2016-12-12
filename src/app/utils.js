const Rx = require('rxjs');

const GeoAPI = require('../api');
const client = require('../db/redis-factory')();

const API = require('../constants').API;
const CHANNEL = require('../constants').CHANNEL;

const appLogger = require('../loggers/app-logger');

let pauser_ = new Rx.Subject();

let geoPolling$_ = Rx.Observable.interval(API.POLLING_INTERVAL)
  .switchMap(() => GeoAPI.getList())
  .do((response) => appLogger.info(response))
  .flatMap(pollingStream_)
  .do(publishDevicesState_)
  .catch(responseErrorHandler_)
  .retry();

let statefulPoller_ = pauser_.switchMap(pollingSwitcher_);

/**
 * Returns stream which polls data from remote
 * server then store data and then publishes to
 * redis
 * @param  {Array} arr array of devices
 * @return {Observable} stream
 */
function pollingStream_(arr) {
  return Rx.Observable.from(arr)
      .flatMap((device) => GeoAPI.getStateOfDevice(device))
      .reduce(accumulateArray, []);
}

/**
 * Reducer function for handling array
 * @param  {Array} acc accumulator
 * @param  {Object} next object to accumulate
 * @return {Array} accumulated array
 */
function accumulateArray(acc, next) {
  acc.push(next);
  return acc;
}

/**
 * Publis device with state to redis
 * @param  {Object} devicesWithState device with geolocation
 */
function publishDevicesState_(devicesWithState) {
  client.publish(CHANNEL.GEO_STATE, JSON.stringify(devicesWithState));
}

/**
 * Switches beetween an empty observable and geoPolling stream
 * @param  {Boolean} turnOn state to turn geopolling on or off
 * @return {Observable} observable
 */
function pollingSwitcher_(turnOn) {
   return turnOn ? geoPolling$_ : Rx.Observable.empty();
}

/**
 * Error handler
 * @param  {Error} error respose error
 * @return {Observable} empty observable
 */
function responseErrorHandler_(error) {
  const response = error.response;
  const status = response.status;
  appLogger.info('%d error happened with next response: %o', status, response);
  return Rx.Observable.empty();
}

module.exports = {
  statefulPoller_,
  pollingStream_,
  pollingSwitcher_,
  pauser_,
  publishDevicesState_,
};
