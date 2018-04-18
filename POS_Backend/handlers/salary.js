var Salary = require('../model/salary');
var Employee = require('../model/employee');

//fetch all salaries
exports.fetchAllSalaries = function (req, res) {
  Salary.find().populate('employee').exec(function (err, salaries) {
    if (err) throw err;
    var context = {
      title: 'salaries',
      salaries: salaries.map(function (salary) {
        return {
          salaryId: salary._id,
          employeeId: salary.employee._id,
          employeeName: salary.employee.fullName,
          amount: salary.amount,
          modifiedDate: salary.modifiedDate,
          createdDate: salary.createdDate
        } 
      })
    };
    res.render('salary/salaries', context);
  });
};

//get: create salary
exports.getCreateSalary = function (req, res) {
  Employee.find(function (err, employees) {
    if (err) {
      console.log('Error fetching this salary' + err.stack);
      return false;
    }
    var context = {
      title: 'create salary',
      action: '/add-salary',
      employees: employees.map(function (employee) {
        return {
          employeeId: employee._id,
          employeeName: employee.fullName,
        }
      }),
      csrfToken: req.csrfToken()
    };
    res.render('salary/create-update-salary', context);
  });
};

//get: update salary
exports.getUpdateSalary = function (req, res) {
  Salary.findById({ _id: req.params.salaryId }, {}).populate('employee').exec(function (err, salary) {
    if (err) {
      console.log('Error fetching this salary' + err.stack);
      return false;
    }
    Employee.find(function (err, employees) {
      if (err) {
        console.log('Error fetching this salary' + err.stack);
        return false;
      }
      var context = {
        title: 'update salary',
        action: '/update-salary',
        salaryId: salary._id,
        employeeId: salary.employee._id,
        employeeName: salary.employee.fullName,
        amount: salary.amount,
        employees: employees.map(function (employee) {
          return {
            employeeId: employee._id,
            employeeName: employee.fullName,
          }
        }),
        modifiedDate: salary.modifiedDate,
        createdDate: salary.createdDate,
        csrfToken: req.csrfToken()
      };
      res.render('salary/create-update-salary', context);
    });
  });
};

//Not in use. pay employee in employee handler is used instead
//create salary
exports.createSalary = function (req, res) {
  var salary = Salary({
    employee: req.body.employee,
    amount: req.body.amount
  });
  salary.save(function (err, salary) {
    if (err) {
      console.log('Error updating this salary' + err.stack);
      return res.send('error');
    }
    req.session.flash = {
      type: 'success',
      intro: 'Success!',
      message: 'Salary successfully created',
    };
    res.redirect(303, 'salaries');
  });
};

//Update Salary
exports.updateSalary = function (req, res) {
  Salary.findOne({ _id: req.body.salaryId }, {}, function (err, salary) {
    if (err) {
      console.log('Error fetching this salary. Ensure this salary is present' + err.stack);
      return false;
    }
    if (salary) {
      salary.employee = req.body.employeeId;
      salary.amount = req.body.amount;
      salary.sMonth = req.body.sMonth;
      salary.sYear = req.body.sYear;
      salary.modifiedDate = Date.now();
      salary.save(function (err, salary) {
        if (err) {
          console.log('Error updating this salary' + err.stack);
          return false;
        }
        req.session.flash = {
          type: 'success',
          intro: 'Success!',
          message: 'Salary successfully updated',
        };
        res.send(200, {success: true});
      });
    } else {
      console.log('No such salary');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'This salary does not exist',
      };
      req.session.flash = myFlash;
      res.send(400, 'Salary not found');
    }
  });
};

//find salary by id
exports.findSalaryById = function (req, res) {
  Salary.findById({ _id: req.params.salaryId }, {}).populate('employee').exec(function (err, salary) {
    if (err) {
      console.log('Error fetching this salary' + err.stack);
      return false;
    }
    if (salary) {
      var context = {
        title: salary.name,
        employeeName: salary.employee.fullName,
        employeeId: salary.employee._id,
        amount: salary.amount,
        modifiedDate: salary.modifiedDate,
        createdDate: salary.createdDate
      };
      res.render('salary/salary-details', context);
    } else {
      console.log('No such salary');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'This salary does not exist',
      };
      req.session.flash = myFlash;
      res.redirect(303, '/salaries');
    }
  });
};

//Delete salary
exports.deleteSalary = function (req, res) {
  Salary.findById({ _id: req.body.salaryId }, function (err, salary) {
    if (err) {
      console.log('Error deleting this salary' + err.stack);
      return false;
    }

    if (salary) {
      salary.remove(function (err) {
        if (err) {
          console.log('salary remove error');
        }
        console.log('Successfully deleted');

        var myFlash = {
          type: 'success',
          intro: 'Success!',
          message: 'Salary successfully deleted',
        };
        req.session.flash = myFlash;
        res.status(200).send({success: true});
      });
    } else {
      console.log('No such salary');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'Salary: ' + req.params.salaryId + ' does not exist',
      };
      req.session.flash = myFlash;
      res.status(400).send('No such salary');
    }
  });
};
