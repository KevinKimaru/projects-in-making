const winston = require('winston');
winston.add(winston.transports.File, {
  filename: 'app.log',
  // handleExceptions: true,
  // humanReadableUnhandledException: true,
  // exitOnError: false
});

module.exports = function log() {
    return winston;
}
