var accountController = require('./controller/account');
var creditController = require('./controller/credit');
var customerOrderController = require('./controller/customerOrder');
var employeeController = require('./controller/employee');
var foodController = require('./controller/food');
var foodCategoryController = require('./controller/foodCategory');
var itemController = require('./controller/item');
var inventoryController = require('./controller/inventory');
var liabilityController = require('./controller/liability');
var salaryController = require('./controller/salary');
var storeOutController = require('./controller/storeOut');
var supplierController = require('./controller/supplier');
var supplierOrderController = require('./controller/supplierOrder');
var indexController = require('./controller/index');
var loginController = require('./controller/login');

module.exports = function (app) {
  loginController.registerRoutes(app);

  //Authenticate
  // app.use(loginController.ensureAuthenticated);

  //setup notifications
  var Inventory = require('./model/inventory');
  app.use(function (req, res, next) {
    res.locals.notifications = [];
    Inventory.find().populate('item').exec(function (err, inventories) {
      if (err) throw err;
      if (inventories) {
        res.locals.notifications = [];
        for (let inventory of inventories) {
          if (inventory.quantity < inventory.item.quantity || inventory.quantity < 2) {
            res.locals.notifications.push('<p style="color: red">' + inventory.item.name + ' is out of stock</p>');
          }
        }
      }
    });
    next();
  });



  accountController.registerRoutes(app);
  creditController.registerRoutes(app);
  customerOrderController.registerRoutes(app);
  employeeController.registerRoutes(app);
  foodController.registerRoutes(app);
  foodCategoryController.registerRoutes(app);
  itemController.registerRoutes(app);
  inventoryController.registerRoutes(app);
  liabilityController.registerRoutes(app);
  salaryController.registerRoutes(app);
  storeOutController.registerRoutes(app);
  supplierController.registerRoutes(app);
  supplierOrderController.registerRoutes(app);
  indexController.registerRoutes(app);


  app.use(function (req, res) {
    res.status(400);
    res.send('404 error');
  });

  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
  });


};
