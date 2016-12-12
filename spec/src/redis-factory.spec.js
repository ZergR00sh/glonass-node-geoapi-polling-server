const redisFactory = require('../../src/db/redis-factory');

describe('redis-factory suite', function() {
    it('should be defined', function() {
      expect(redisFactory instanceof Function).toBe(true);
    });
    it('should return an object', function() {
      const client = redisFactory();
      expect(client instanceof Object).toBeTruthy();
      client.end(true);
    });
    it('should perform communication with redis', function(done) {
      const client = redisFactory();
      client.set('key', 20, function(err, result) {
        expect(result === 'OK').toBeTruthy();
        client.end(true);
        done();
      });
    });
    it('should return pong on ping', function(done) {
      const client = redisFactory();
      client.ping(function(err, result) {
        expect(result === 'PONG').toBeTruthy();
        client.end(true);
        done();
      });
    });
});
