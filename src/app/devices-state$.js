const messages$ = require('./messages$');
const pollingSwitcher = require('./polling-switcher');

const devicesState$ = messages$.switchMap(pollingSwitcher);

module.exports = devicesState$;
