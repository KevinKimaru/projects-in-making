var customerOrderHandler = require('../handlers/customerOrder');
var csrf = require('csurf');

module.exports =  {
    registerRoutes: function(app) {
        app.get( '/add-customerOrder', function(req, res, next) {
          csrf();
          next();
        }, customerOrderHandler.getCreateCustomerOrder);

        // app.get( '/update-credit/:creditId', function(req, res, next) {
        //   csrf();
        //   next();
        // }, creditHandler.getUpdateCredit);
        //
        // app.post( '/update-credit', function(req, res, next) {
        //   csrf();
        //   next();
        // }, creditHandler.updateCredit);

        app.post( '/add-customerOrder', function(req, res, next) {
          csrf();
          next();
        }, customerOrderHandler.createCustomerOrder);

        app.get('/customerOrders', customerOrderHandler.fetchAllCustomerOrders);

        app.get('/customerOrder/:customerOrderId', customerOrderHandler.findCustomerOrderById);

        app.get('/delete-customerOrder/:customerOrderId', customerOrderHandler.deleteCustomerOrder);
    },
};
