//salaries
//liabilities
//store out
//customer orders

var Salary = require('../model/salary');
var Liability = require('../model/liability');
var StoreOut = require('../model/storeOut');
var CustomerOrder = require('../model/customerOrder');

exports.monthlyReport = function(req, res) {
  var month = req.query.month;
  var year = req.query.year;
  var date = new Date(year + '-' + month);
  var salariesSum = Salary.aggregate([{
      $match: {createdDate: {$gte: date, $lte: date}}
  },{$group: {_id: null, total: {$sum: '$amount'}}}], function(err, salariesSum) {
      if(err) {
        console.log('OOps an error occurred while finding sum of salaries. ' + err.stack);
      }
  });
  var liabilitiesSum = Liability.aggregate([{
      $match: {createdDate: {$gte: date, $lte: date}}
  },{$group: {_id: null, total: {$sum: '$amount'}}}], function(err, liabilitiesSum) {
      if(err) {
        console.log('OOps an error occurred while finding sum of liabilities. ' + err.stack);
      }
  });
  var storeOutsSum =
  StoreOut.find({}, {}).populate().exec(function(err, employees) {
    if(err) {
      console.log('Error while fetching employees: ' + err.stack);
      return false;
    }

  });
};
