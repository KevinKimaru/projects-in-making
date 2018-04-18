///////////////////////////////////////////////////////////////////////////
/////THIS MODULE WAS ONLY FOR TESTING IT SHAL NOT BE USED ON PRODUCTION////
///////////////////////////////////////////////////////////////////////////

var accountHandler = require('../handlers/account');
var csrf = require('csurf');

module.exports =  {
    registerRoutes: function(app) {
        app.get( '/add-account', function(req, res, next) {
          csrf();
          next();
        }, accountHandler.getCreateAccount);

        app.get( '/update-account/:accountId', function(req, res, next) {
          csrf();
          next();
        }, accountHandler.getUpdateAccount);

        app.post( '/update-account', function(req, res, next) {
          csrf();
          next();
        }, accountHandler.updateAccount);

        app.post( '/add-account', function(req, res, next) {
          csrf();
          next();
        }, accountHandler.createAccount);

        app.get('/accounts', accountHandler.fetchAllAccounts);

        app.get('/account/:accountId', accountHandler.findAccountById);

        app.get('/delete-account/:accountId', accountHandler.deleteAccount);
    },
};
