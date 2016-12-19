const Rx = require('rxjs');
const geoPolling$ = require('./geo-polling$');

/**
 * Switches beetween an empty observable and geoPolling stream
 * @param  {Boolean} turnOn state to turn geopolling on or off
 * @return {Observable} observable
 */
function pollingSwitcher(turnOn) {
   return turnOn ? geoPolling$ : Rx.Observable.never();
}

module.exports = pollingSwitcher;
