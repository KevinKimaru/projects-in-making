var supplierOrderHandler = require('../handlers/supplierOrder');
var csrf = require('csurf');
var auth = require('../controller/login');

module.exports =  {
    registerRoutes: function(app) {
        app.get( '/add-supplierOrder', function(req, res, next) {
          csrf();
          next();
        }, supplierOrderHandler.getCreateSupplierOrder);

        app.get( '/update-supplierOrder/:supplierOrderId', function(req, res, next) {
          csrf();
          next();
        }, supplierOrderHandler.getUpdateSupplierOrder);

        app.post( '/update-supplierOrder', function(req, res, next) {
          csrf();
          next();
        }, supplierOrderHandler.updateSupplierOrder);

        app.post( '/add-supplierOrder', function(req, res, next) {
          csrf();
          next();
        }, supplierOrderHandler.createSupplierOrder);

        app.get('/supplierOrders', supplierOrderHandler.fetchAllSupplierOrders);

        app.get('/supplierOrder', supplierOrderHandler.findSupplierOrderById);

        app.post('/delete-supplierOrder', supplierOrderHandler.deleteSupplierOrder);
    },
};
