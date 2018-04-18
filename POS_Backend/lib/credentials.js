module.exports = {
  mongo: {
    development: {
      connectionString: 'mongodb://127.0.0.1/hotelbackend',
      // connectionString: 'mongodb://kevinkimaru:kevinkimaru@ds163918.mlab.com:63918/hotelbackend',
    },
    production: {
      // connectionString: 'mongodb://127.0.0.1/hotelbackend',
      connectionString: 'mongodb://kevinkimaru:kevinkimaru@ds163918.mlab.com:63918/hotelbackend',
    }
  },
  session: {
    secret: 'knowledge is power'
  }
};
