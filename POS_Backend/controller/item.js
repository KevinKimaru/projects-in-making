var itemHandler = require('../handlers/item');
var csrf = require('csurf');

module.exports =  {
    registerRoutes: function(app) {
        app.get( '/add-item', function(req, res, next) {
          csrf();
          next();
        }, itemHandler.getCreateItem);

        app.post( '/add-item', function(req, res, next) {
          csrf();
          next();
        }, itemHandler.createItem);

        app.get( '/update-item/:itemId', function(req, res, next) {
          csrf();
          next();
        }, itemHandler.getUpdateItem);

        app.post( '/update-item', function(req, res, next) {
          csrf();
          next();
        }, itemHandler.updateItem);

        app.get('/items', itemHandler.fetchAllItems);

        app.get('/item/:itemId', itemHandler.findItemById);

        app.post('/delete-item', itemHandler.deleteItem);
        app.post('/deactivate-item', itemHandler.deactivateItem);
    },
};
