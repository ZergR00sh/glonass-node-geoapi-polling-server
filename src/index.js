const DevicesPublisher = require('./app');
const CHANNEL = require('./constants').CHANNEL;

const publisher = new DevicesPublisher(CHANNEL.GEO_STATE);

publisher.start();
