var inventoryHandler = require('../handlers/inventory');
var csrf = require('csurf');

module.exports =  {
    registerRoutes: function(app) {
        app.get( '/add-inventory', function(req, res, next) {
          csrf();
          next();
        }, inventoryHandler.getCreateInventory);

        app.post( '/add-inventory', function(req, res, next) {
          csrf();
          next();
        }, inventoryHandler.createInventory);

        app.get( '/update-inventory/:inventoryId', function(req, res, next) {
          csrf();
          next();
        }, inventoryHandler.getUpdateInventory);

        app.post( '/update-inventory', function(req, res, next) {
          csrf();
          next();
        }, inventoryHandler.updateInventory);

        app.get('/inventories', inventoryHandler.fetchAllInventories);

        app.get('/inventory/:inventoryId', inventoryHandler.findInventoryById);

        app.get('/delete-inventory/:inventoryId', inventoryHandler.deleteInventory);
    },
};
