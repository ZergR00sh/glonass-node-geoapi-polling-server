const Api = require('../../src/api');
const mock = require('../helpers/api-stub.js');

describe('Api suite', function() {
  let deviceExample = {
      imei: '1231231',
      name: 'BlaBla',
  };
  beforeAll(function() {
    mock.onGet(Api.listURI_).reply(200, require('../fixtures/devices.json'))
    .onGet(Api.getStateURI_(deviceExample.imei)).reply(200, {
      imei: '1231231',
      ts: '0000-00-00 00:00:00',
      lat: 123123,
      lng: 123123,
      azimut: 350,
      speed: 20,
    });
  });

  afterAll(function() {
    mock.reset();
  });

  describe('getStateURI_ suite', function() {
    it('should be a function', function() {
      expect(Api.getStateURI_).toBeDefined();
      expect(typeof Api.getStateURI_).toEqual('function');
    });
    it('should return string', function() {
      expect(typeof Api.getStateURI_('imei1337')).toEqual('string');
    });
  });

  describe('getList suite', function() {
    it('should be a function', function() {
      expect(Api.getList).toBeDefined();
      expect(typeof Api.getList).toEqual('function');
    });

    it('should return a Promise', function() {
      expect(Api.getList() instanceof Promise).toBeTruthy();
    });

    it('getList reponse should be an array', function(done) {
      Api.getList().then(function(devices) {
        expect(devices instanceof Array).toBeTruthy();
        done();
      });
    });
  });

  describe('getStateOfDevice suite', function() {
    it('should be a function', function() {
      expect(Api.getStateOfDevice).toBeDefined();
      expect(typeof Api.getStateOfDevice).toEqual('function');
    });

    it('should return a Promise', function() {
      let result = Api.getStateOfDevice(deviceExample);
      expect(result instanceof Promise).toBeTruthy();
    });

    it('should respond with an object', function(done) {
      Api.getStateOfDevice(deviceExample).then(function(device) {
        expect(device instanceof Object).toBeTruthy();
        expect(device.lng && device.lat).toBeDefined();
      }).then(done);
    });
  });
});
