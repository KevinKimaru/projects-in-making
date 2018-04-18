var salaryHandler = require('../handlers/salary');
var csrf = require('csurf');

module.exports =  {
    registerRoutes: function(app) {
        app.get( '/add-salary', function(req, res, next) {
          csrf();
          next();
        }, salaryHandler.getCreateSalary);

        app.get( '/update-salary/:salaryId', function(req, res, next) {
          csrf();
          next();
        }, salaryHandler.getUpdateSalary);

        app.post( '/update-salary', function(req, res, next) {
          csrf();
          next();
        }, salaryHandler.updateSalary);

        app.post( '/add-salary', function(req, res, next) {
          csrf();
          next();
        }, salaryHandler.createSalary);

        app.get('/salaries', salaryHandler.fetchAllSalaries);

        app.get('/salary/:salaryId', salaryHandler.findSalaryById);

        app.post('/delete-salary', salaryHandler.deleteSalary);
    },
};
