var supplierHandler = require('../handlers/supplier');
var csrf = require('csurf');

module.exports =  {
    registerRoutes: function(app) {
        app.get( '/add-supplier', function(req, res, next) {
          csrf();
          next();
        }, supplierHandler.getCreateSupplier);

        app.post( '/add-supplier', function(req, res, next) {
          csrf();
          next();
        }, supplierHandler.createSupplier);

        app.get( '/update-supplier/:supplierId', function(req, res, next) {
          csrf();
          next();
        }, supplierHandler.getUpdateSupplier);

        app.post( '/update-supplier', function(req, res, next) {
          csrf();
          next();
        }, supplierHandler.updateSupplier);

        app.get('/suppliers', supplierHandler.fetchAllSuppliers);

        app.get('/availableSuppliers', supplierHandler.fetchAvailableSuppliers);

        app.get('/supplier', supplierHandler.findSupplierById);

        app.post('/delete-supplier', supplierHandler.deleteSupplier);
        app.post('/deactivate-supplier', supplierHandler.deactivateSupplier);
        app.post('/update-supplierAccount', supplierHandler.updateAccount);
        app.post('/pay-supplier', supplierHandler.paySupplier);
    },
};
