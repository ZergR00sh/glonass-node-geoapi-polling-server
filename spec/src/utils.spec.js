const Rx = require('rxjs');
const mock = require('../helpers/api-stub.js');
const utils = require('../../src/app/utils');
const CHANNEL = require('../../src/constants').CHANNEL;
const redisFactory = require('../../src/db/redis-factory');
const Api = require('../../src/api');

describe('utils suite', function() {
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

  describe('example suite', function() {
    it('is an example for how i will test Rx observables', function(done) {
      let observable$ = Rx.Observable.interval(1000).mapTo(true);
      let subscription = observable$.subscribe(function(el) {
        expect(el).toBe(true);
        subscription.unsubscribe();
        done();
      });
    });
  });

  describe('statefulPoller_ suite', function() {
    const statefulPoller_ = utils.statefulPoller_;
    const pauser_ = utils.pauser_;
    it('should be defined', function() {
      expect(statefulPoller_).toBeDefined();
    });

    it('should be instance of Rx.AnonymousSubject', function() {
      expect(statefulPoller_ instanceof Rx.AnonymousSubject).toBeTruthy();
    });

    it('should communicate with geoapi and respond to redis', function(done) {
      const client = redisFactory();
      let subscription = statefulPoller_.subscribe();
      client.on('message', function(channel, message) {
        if (channel === CHANNEL.GEO_STATE) {
          pauser_.next(false);
          subscription.unsubscribe();
          expect(message === JSON.stringify(devices)).toBe(true);
          client.unsubscribe(CHANNEL.GEO_STATE);
          client.end(true);
          done();
        }
      });
      client.subscribe(CHANNEL.GEO_STATE);
      client.on('subscribe', function() {
        pauser_.next(true);
      });
    });
  });

  describe('pollingStreamFactory_ suite', function() {
    const pollingStreamFactory_ = utils.pollingStreamFactory_;
    it('should return an Observable', function() {
      expect(pollingStreamFactory_([]) instanceof Rx.Observable).toBe(true);
    });
    it('should communicate with geoapi', function(done) {
      pollingStreamFactory_(devices).subscribe(function(res) {
        expect(JSON.stringify(res) === JSON.stringify(devices)).toBe(true);
        done();
      });
    });
  });

  describe('pollingSwitcher_ suite', function() {
    const pollingSwitcher_ = utils.pollingSwitcher_;
    it('should be a function', function() {
      expect(pollingSwitcher_ instanceof Function).toBe(true);
    });

    it('should return an Observable if both true or false passed', function() {
      const ifTrue = pollingSwitcher_(true);
      expect(ifTrue instanceof Rx.Observable).toBe(true);
      const otherwise = pollingSwitcher_(false);
      expect(otherwise instanceof Rx.Observable).toBe(true);
    });

    it('return an Observable if true passed as an argument', function() {
      expect(pollingSwitcher_(true) instanceof Rx.Observable).toBe(true);
    });
  });

  describe('publishDevicesState_ suite', function() {
    const publishDevicesState_ = utils.publishDevicesState_;
    const fixture = {message: 'example.coords'};
    const client = redisFactory();
    it(`should communicate with redis on ${CHANNEL.GEO_STATE}`, function(done) {
      client.subscribe(CHANNEL.GEO_STATE);

      client.on('message', function(channel, message) {
        if(channel === CHANNEL.GEO_STATE) {
          expect(message === JSON.stringify(fixture)).toBe(true);
          client.unsubscribe(CHANNEL.GEO_STATE);
          client.end(true);
          done();
        }
      });

      publishDevicesState_(fixture);
    });
  });
});
