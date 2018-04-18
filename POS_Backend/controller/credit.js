var creditHandler = require('../handlers/credit');
var csrf = require('csurf');

module.exports =  {
    registerRoutes: function(app) {
        app.get( '/add-credit', function(req, res, next) {
          csrf();
          next();
        }, creditHandler.getCreateCredit);

        app.post( '/add-credit', function(req, res, next) {
          csrf();
          next();
        }, creditHandler.createCredit);

        app.get('/credits', creditHandler.fetchAllCredits);

        app.get('/credit', creditHandler.findCreditById);

        app.post('/delete-credit', creditHandler.deleteCredit);
    },
};
