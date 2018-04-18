var foodHandler = require('../handlers/food');
var csrf = require('csurf');

module.exports =  {
    registerRoutes: function(app) {
        app.get( '/add-food', function(req, res, next) {
          csrf();
          next();
        }, foodHandler.getCreateFood);

        app.get( '/update-food/:foodId', function(req, res, next) {
          csrf();
          next();
        }, foodHandler.getUpdateFood);

        app.post( '/update-food', function(req, res, next) {
          csrf();
          next();
        }, foodHandler.updateFood);

        app.post( '/add-food', function(req, res, next) {
          csrf();
          next();
        }, foodHandler.createFood);

        app.get('/foods', foodHandler.fetchAllFoods);

        app.get('/food', foodHandler.findFoodById);

        app.post('/delete-food/:foodId', foodHandler.deleteFood);
        app.post('/deactivate-food', foodHandler.deactivateFood);
    },
};
