var indexHandler = require('../handlers/index');
var csrf = require('csurf');

module.exports =  {
    registerRoutes: function(app) {
        app.get( '/', function(req, res, next) {
          csrf();
          next();
        }, indexHandler.calculateTodaySales);
    },
};
