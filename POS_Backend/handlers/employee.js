var Employee = require('../model/employee');
var Account = require('../model/account');
var CustomerOrder = require('../model/customerOrder');
var dates = require('../lib/dates');
var Salary = require('../model/salary');
var mongoose = require('mongoose');
var Transaction = require('mongoose-transaction')(mongoose);
var bcrypt = require('bcrypt');

//fetch all employees
exports.fetchAllEmployees = function (req, res) {
  Employee.find({}, {}).populate('account').exec(function (err, employees) {
    if (err) {
      console.log('Error fetching all employees' + err.stack);
      res.send('error');
    }
    var context = {
      title: 'employees',
      employees: employees.map(function (employee) {
        return {
          employeeId: employee._id,
          name: employee.fullName2,
          idNumber: employee.idNumber,
          email: employee.email,
          phoneNumber: employee.phoneNumber,
          role: employee.role,
          position: employee.position,
          status: employee.status,
        }
      })
    };
    CustomerOrder.aggregate([
      { $match: { createdDate: { $gte: dates.sMonth, $lt: dates.sNMonth } } },
      { $group: { _id: '$waiter', total: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]).then(function (results) {
      context.waitersActivity = [];
      for (let result of results) {

        Employee.findById(result._id, function (err, waiter) {
          if (err) throw err;
          if (waiter) {
            context.waitersActivity.push({ waiter: waiter.fullName, orders: result.total });
          }
          if (result === results[results.length - 1]) {
            console.log(context);
            res.render('employee/employees', context);
          }
        })
      }
    });
  });
};

exports.fetchAvailableEmployees = function (req, res) {
  Employee.find({ status: 'activated' }, {}).populate('account').exec(function (err, employees) {
    if (err) {
      console.log('Error fetching all employees' + err.stack);
      res.send('error');
    }
    var context = {
      title: 'employees',
      employees: employees.map(function (employee) {
        return {
          employeeId: employee._id,
          name: employee.fullName2,
          idNumber: employee.idNumber,
          email: employee.email,
          phoneNumber: employee.phoneNumber,
          role: employee.role,
          position: employee.position,
          status: employee.status,
        }
      })
    };
    res.render('employee/employees', context);
  });
};

//get: create employee
exports.getCreateEmployee = function (req, res) {
  var context = {
    title: 'create employee',
    action: '/add-employee',
    csrfToken: req.csrfToken()
  };
  res.render('employee/create-update-employee', context);
}

//get: update employee
exports.getUpdateEmployee = function (req, res) {
  Employee.findById({ _id: req.params.employeeId }, {}).populate('account').exec(function (err, employee) {
    if (err) {
      console.log('Error fetching this employee' + err.stack);
      return false;
    }
    var context = {
      title: 'update employee',
      action: '/update-employee',
      update: true,
      employeeId: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      idNumber: employee.idNumber,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      address: employee.address,
      postalCode: employee.postalCode,
      city: employee.city,
      role: employee.role,
      position: employee.position,
      status: employee.status,
      accountId: employee.account._id,
      accountNumber: employee.account.accountNumber,
      bank: employee.account.bank,
      csrfToken: req.csrfToken()
    };
    res.render('employee/create-update-employee', context);
  });
};

//create employee
exports.createEmployee = function (req, res) {
  var account = Account({
    _id: mongoose.Types.ObjectId(),
    accountNumber: req.body.accountNumber,
    bank: req.body.bank
  });
  bcrypt.hash(req.body.firstName, 10, function (err, hash) {
    if (err) throw err;
    var employee = Employee({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      idNumber: req.body.idNumber,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      postalCode: req.body.postalCode,
      city: req.body.city,
      role: req.body.role,
      position: req.body.position,
      account: account._id,
      password: hash,
    });
    var transaction = new Transaction();
    transaction.insert('Employee', employee);
    transaction.insert('Account', account);
    transaction.run(function (err, docs) {
      if (err) throw err;
      req.session.flash = {
        type: 'success',
        intro: 'Success!',
        message: 'Employee ' + employee.fullName2 + ' successfully created',
      };
      res.redirect(303, 'employees');
    });
  });

};

//Update employee
exports.updateEmployee = function (req, res) {
  console.log(req.body);
  Employee.findOne({ _id: req.body.employeeId, status: 'activated' }, {}, function (err, employee) {
    if (err) {
      console.log('Error fetching this employee. Ensure this employee is present ' + err.stack);
      return false;
    }
    if (employee) {
      employee.firstName = req.body.firstName,
        employee.lastName = req.body.lastName,
        employee.idNumber = req.body.idNumber,
        employee.email = req.body.email,
        employee.phoneNumber = req.body.phoneNumber,
        employee.address = req.body.address,
        employee.postalCode = req.body.postalCode,
        employee.city = req.body.city,
        employee.role = req.body.role,
        employee.position = req.body.position,
        employee.modifiedDate = Date.now();
      employee.save(function (err, employee) {
        if (err) {
          console.log('Error updating this employee' + err.stack);
          return false;
        }
        req.session.flash = {
          type: 'success',
          intro: 'Success!',
          message: 'Employee ' + employee.fullName + ' successfully updated',
        };
        res.send({ succes: true });
      });
    } else {
      console.log('No such employee');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'This employee does not exist',
      };
      req.session.flash = myFlash;
      res.send(500, { error: true });
    }
  });
};

//find employee by id
exports.findEmployeeById = function (req, res) {
  Employee.findById({ _id: req.query.employeeId }, {}).
    populate('account').
    exec(function (err, employee) {
      if (err) {
        console.log('Error fetching this employee ' + err.stack);
        return false;
      }
      if (employee) {
        var context = {
          title: 'employee',
          employeeId: employee._id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          idNumber: employee.idNumber,
          address: employee.address,
          postalCode: employee.postalCode,
          city: employee.city,
          email: employee.email,
          phoneNumber: employee.phoneNumber,
          role: employee.role,
          position: employee.position,
          status: employee.status,
          accountNumber: employee.account.accountNumber,
          bank: employee.account.bank,
          modifiedDate: employee.modifiedDate,
          createdDate: employee.createdDate,
          csrfToken: req.csrfToken()
        };

        CustomerOrder.find({ waiter: req.query.employeeId }, function (err, customerOrders) {
          if (err) throw err;
          context.customerOrders = customerOrders.map(function (customerOrder) {
            return {
              customerOrderId: customerOrder._id,
              table: customerOrder.table,
              foods: customerOrder.foods,
              status: customerOrder.status,
              length: customerOrder.foods.length + 1,
              waiter: customerOrder.waiter.fullName,
              modifiedDate: customerOrder.modifiedDate,
              createdDate: customerOrder.createdDate
            };
          });

          Salary.find({ employee: req.query.employeeId }, function (err, salaries) {
            if (err) throw err;
            context.salaries = salaries.map(function (salary) {
              return {
                salaryId: salary._id,
                employeeId: salary.employee._id,
                employeeName: salary.employee.fullName,
                amount: salary.amount,
                month: salary.sMonth,
                year: salary.sYear,
                modifiedDate: salary.modifiedDate,
                createdDate: salary.createdDate
              }
            });

            res.render('employee/employee-details', context);
          });

        });
      } else {
        console.log('No such employee');
        var myFlash = {
          type: 'danger',
          intro: 'Error!',
          message: 'This employee does not exist',
        };
        req.session.flash = myFlash;
        res.redirect(303, '/employees');
      }
    });
};

//Delete employee
exports.deleteEmployee = function (req, res) {
  Employee.findById({ _id: req.body.employeeId }).populate('account').exec(function (err, employee) {
    if (err) {
      console.log('Error deleting this employee' + err.stack);
      return false;
    }

    if (employee) {
      employee.account.remove(function (err, account) {
        if (err) {
          console.log('employee account remove error');
          return false;
        }
        employee.remove(function (err) {
          if (err) {
            console.log('employee remove error');
            return false;
          }

          var myFlash = {
            type: 'success',
            intro: 'Success!',
            message: 'Employee successfully deleted',
          };
          req.session.flash = myFlash;
          res.send({ success: true });
        });
      });
    } else {
      console.log('No such employee');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'Employee: ' + req.params.employeeId + ' does not exist',
      };
      req.session.flash = myFlash;
      res.send(500, { success: false });
    }
  });
};

//Deactivate employee
exports.deactivateEmployee = function (req, res) {
  Employee.findById({ _id: req.body.employeeId }).populate('account').exec(function (err, employee) {
    if (err) {
      console.log('Error deleting this employee' + err.stack);
      return false;
    }

    if (employee) {
      employee.status = 'deactivated';
      employee.account.status = 'deactivated';
      employee.modifiedDate = Date.now();
      employee.save(function (err, employee) {
        if (err) {
          console.log('employee remove error');
          return false;
        }

        var myFlash = {
          type: 'success',
          intro: 'Success!',
          message: 'Employee successfully deactivated',
        };
        req.session.flash = myFlash;
        res.send({ success: true });
      });
    } else {
      console.log('No such employee');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'Employee: ' + req.params.employeeId + ' does not exist',
      };
      req.session.flash = myFlash;
      res.send(500, { error: true });
    }
  });
};

//update employees account
exports.updateAccount = function (req, res) {
  console.log(req.body);
  Employee.findById({ _id: req.body.employeeId }).populate('account').exec(function (err, employee) {
    if (err) throw err;
    if (employee) {
      employee.account.accountNumber = req.body.accountNumber;
      employee.account.bank = req.body.bank;
      employee.modifiedDate = Date.now();
      employee.account.save(function (err, account) {
        if (err) throw err;
        req.session.flash = {
          type: 'success',
          intro: 'Success!',
          message: 'Account ' + account.accountNumber + ' successfully updated',
        };
        res.send({ success: true });
      });
    } else {
      console.log('No such account');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'This account does not exist',
      };
      req.session.flash = myFlash;
      res.send(500, { error: true });
    }

  });
};

exports.payEmployee = function (req, res) {
  Employee.findById({ _id: req.body.employeeId, status: 'activated' }, function (err, employee) {
    if (err) throw err;
    if (employee) {
      var salary = new Salary({
        employee: req.body.employeeId,
        amount: req.body.amount,
        sMonth: req.body.sMonth,
        sYear: req.body.sYear
      });
      salary.save(function (err, salary) {
        if (err) throw err;
        var myFlash = {
          type: 'success',
          intro: 'Success!',
          message: 'Successfully paid this employee',
        };
        req.session.flash = myFlash;
        res.send({ success: true });
      });
    } else {
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'This employee does not exist',
      };
      req.session.flash = myFlash;
      res.send(500, { error: true });
    }
  });
};



