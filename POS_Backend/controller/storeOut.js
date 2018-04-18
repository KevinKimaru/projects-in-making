var storeOutHandler = require('../handlers/storeOut');
var csrf = require('csurf');

module.exports =  {
    registerRoutes: function(app) {
        app.get( '/add-storeOut', function(req, res, next) {
          csrf();
          next();
        }, storeOutHandler.getCreateStoreOut);

        app.get( '/update-storeOut/:storeOutId', function(req, res, next) {
          csrf();
          next();
        }, storeOutHandler.getUpdateStoreOut);

        app.post( '/update-storeOut', function(req, res, next) {
          csrf();
          next();
        }, storeOutHandler.updateStoreOut);

        app.post( '/add-storeOut', function(req, res, next) {
          csrf();
          next();
        }, storeOutHandler.createStoreOut);

        app.get('/storeOuts', storeOutHandler.fetchAllStoreOuts);

        app.get('/storeOut/:storeOutId', storeOutHandler.findStoreOutById);

        app.post('/delete-storeOut', storeOutHandler.deleteStoreOut);
    },
};
