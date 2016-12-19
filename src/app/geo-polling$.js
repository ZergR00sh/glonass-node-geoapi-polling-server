const GeoAPI = require('../api');
const API = require('../constants').API;
const Rx = require('rxjs');

const geoPolling$ = Rx.Observable.timer(0, API.POLLING_INTERVAL)
  .switchMap(GeoAPI.getList)
  .flatMap(pollingStreamFactory);

/**
 * Returns stream which polls data from remote
 * server then store data as array
 * @param  {Array} arr array of devices
 * @return {Observable} stream
 */
function pollingStreamFactory(arr) {
  return Rx.Observable.from(arr)
      .flatMap(GeoAPI.getStateOfDevice)
      .reduce((accumulator, next) => {
          accumulator.push(next);
          return accumulator;
      }, []);
}

module.exports = geoPolling$;
