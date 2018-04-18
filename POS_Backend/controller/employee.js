var employeeHandler = require('../handlers/employee');
var csrf = require('csurf');
var express = require('express');

module.exports = {
  registerRoutes: function (app) {
    app.get('/add-employee', function (req, res, next) {
      csrf();
      next();
    }, employeeHandler.getCreateEmployee);

    app.post('/add-employee', function (req, res, next) {
      csrf();
      next();
    }, employeeHandler.createEmployee);

    app.get('/update-employee/:employeeId', function (req, res, next) {
      csrf();
      next();
    }, employeeHandler.getUpdateEmployee);

    app.post('/update-employee', function (req, res, next) {
      csrf();
      next();
    }, employeeHandler.updateEmployee);

    app.get('/employees', employeeHandler.fetchAllEmployees);

    app.get('/availableEmployees', employeeHandler.fetchAvailableEmployees);

    app.get('/employee', function (req, res, next) {
      csrf();
      next();
    }, employeeHandler.findEmployeeById);

    app.post('/update-employeeAccount', function (req, res, next) {
      csrf();
      next();
    }, employeeHandler.updateAccount);

    app.post('/delete-employee', employeeHandler.deleteEmployee);

    app.post('/deactivate-employee', employeeHandler.deactivateEmployee);

    app.post('/pay-employee', employeeHandler.payEmployee);
  },
};
