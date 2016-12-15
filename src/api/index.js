const axios = require('axios');
const API = require('../constants').API;
const listURI_ = `${API.BASE}/api/getList?auth=${API.KEY}`;
let prevDevices = [];

/**
 * Return URI for getState GeoAPI
 * @param  {String} imei of device
 * @return {String} URI for GeoAPI usage
 */
function getStateURI_(imei) {
  return `${API.BASE}/api/getState?auth=${API.KEY}&imei=${imei}`;
}

/**
 * Return API call promise with list of devices
 * @return {Promise} API promise
 */
function getList() {
  return axios.get(listURI_)
    .then((response) => {
      prevDevices = response.data;
      return response.data;
    })
    .catch((err) => prevDevices);
}

/**
 * Return API call promise with state of device passed
 * @param  {Object} device object contains imei and name
 * @return {Promise} API promise
 */
function getStateOfDevice(device) {
  return axios.get(getStateURI_(device.imei))
    .then((response) => {
      response.data.name = device.name;
      return response.data;
    })
    .catch(function(err) {
      console.error(err);
      return Object.assign(device, {
        isEnabled: false,
      });
    });
}

module.exports = {
  getList,
  getStateOfDevice,
  getStateURI_,
  listURI_,
};
