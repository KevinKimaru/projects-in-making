var liabilityHandler = require('../handlers/liability');
var csrf = require('csurf');

module.exports =  {
    registerRoutes: function(app) {
        app.get( '/add-liability', function(req, res, next) {
          csrf();
          next();
        }, liabilityHandler.getCreateLiability);

        app.post( '/add-liability', function(req, res, next) {
          csrf();
          next();
        }, liabilityHandler.createLiability);


        app.get( '/update-liability/:liabilityId', function(req, res, next) {
          csrf();
          next();
        }, liabilityHandler.getUpdateLiability);

        app.post( '/update-liability', function(req, res, next) {
          csrf();
          next();
        }, liabilityHandler.updateLiability);

        app.get('/liabilities', liabilityHandler.fetchAllLiabilities);

        app.get('/liability/:liabilityId', liabilityHandler.findLiabilityById);

        app.post('/delete-liability', liabilityHandler.deleteLiability);
    },
};
