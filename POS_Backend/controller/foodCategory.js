var foodCategoryHandler = require('../handlers/foodCategory');
var csrf = require('csurf');

module.exports =  {
    registerRoutes: function(app) {
        app.get( '/add-foodCategory', function(req, res, next) {
          csrf();
          next();
        }, foodCategoryHandler.getCreateFoodCategory);

        app.get( '/update-foodCategory/:foodCategoryId', function(req, res, next) {
          csrf();
          next();
        }, foodCategoryHandler.getUpdateFoodCategory);

        app.post( '/update-foodCategory', function(req, res, next) {
          csrf();
          next();
        }, foodCategoryHandler.updateFoodCategory);

        app.post( '/add-foodCategory', function(req, res, next) {
          csrf();
          next();
        }, foodCategoryHandler.createFoodCategory);

        app.get('/foodCategories', foodCategoryHandler.fetchAllfoodCategories);

        app.get('/foodCategory/:foodCategoryId', foodCategoryHandler.findFoodCategoryById);

        app.get('/delete-foodCategory/:foodCategoryId', foodCategoryHandler.deleteFoodCategory);
    },
};
