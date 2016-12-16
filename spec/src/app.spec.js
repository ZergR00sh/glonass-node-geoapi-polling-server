const mock = require('../helpers/api-stub.js');
const poller = require('../../src/app');
const CHANNEL = require('../../src/constants').CHANNEL;
const POLLING_INTERVAL = require('../../src/constants').API.POLLING_INTERVAL;
const redisFactory = require('../../src/db/redis-factory');
const Api = require('../../src/api');

describe('app suite', function() {
  let devices = require('../fixtures/devices.json');

  beforeAll(function() {
    mock.onGet(Api.listURI_)
      .reply(200, devices)
      .onGet(new RegExp(Api.getStateURI_('') + '[0-9a-fA-F]*$').compile())
      .reply(function(config) {
        let result = /imei=([0-9a-fA-F]+)/.exec(config.url);
        let imei = result[1];
        return [200, devices.find((device) => device.imei === imei)];
      });
  });

  afterAll(function() {
    mock.reset();
  });

  describe('poller suite', function() {
    const client = redisFactory();
    it('should polling depend on redis input commands', function(done) {
      let i = 0;
      poller.start(function(res) {
        client.publish(CHANNEL.HAS_USERS, CHANNEL.MSGS.LAST_USER_LEFT);
        if(++i === 2) {
          client.end(true);
          poller.stop();
          done();
        }
      });
      client.publish(CHANNEL.HAS_USERS, CHANNEL.MSGS.FIRST_USER_ARRIVED);
      setTimeout(function() {
        client.publish(CHANNEL.HAS_USERS, CHANNEL.MSGS.FIRST_USER_ARRIVED);
      }, POLLING_INTERVAL + 100);
    }, POLLING_INTERVAL + 400 /* 6s */);
  });
});
