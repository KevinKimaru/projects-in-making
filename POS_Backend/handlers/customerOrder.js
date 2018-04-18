var CustomerOrder = require('../model/customerOrder');
var Waiter = require('../model/employee');
var Food = require('../model/food');


//fetch all customer orders
exports.fetchAllCustomerOrders = function (req, res) {
  if(req.query.from == '1') {
    var squery;
    if(req.query.from && req.query.to) {
     
    } else if(req.query.from){
      
    }
    CustomerOrder.find({}).populate('waiter').populate('foods.food').exec( function (err, customerOrders) {
        if (err) {
          console.log('Error while fetching customer orders: ' + err.stack);
          res.send('error');
        }
        var scustomerOrders = [];
        for (const customerOrder of customerOrders) {
          // if(customerOrder.createdDate >= new Date(req.query.from) && customerOrder.createdDate <= new Date(req.query.to)) {
            scustomerOrders.push(
              {
                customerOrderId: customerOrder._id,
                table: customerOrder.table,
                foods: customerOrder.foods,
                amount: customerOrder.amount,
                status: customerOrder.status,
                length: customerOrder.foods.length + 1,
                // waiter: customerOrder.waiter.fullName,
                modifiedDate: customerOrder.modifiedDate,
                createdDate: customerOrder.createdDate
              }
            );
          // }
        }
        res.render('customerOrder/customerOrders', context);
    });
  } else {
    CustomerOrder.find({}, {}).populate('waiter').
    populate('foods.food', 'name -_id price').
    exec( function (err, customerOrders) {
        if (err) {
          console.log('Error while fetching customer orders: ' + err.stack);
          res.send('error');
        }
        var context ={
          title: 'customer orders',
          customerOrders: customerOrders.map(function (customerOrder) {
              return {
                  customerOrderId: customerOrder._id,
                  table: customerOrder.table,
                  foods: customerOrder.foods,
                  amount: customerOrder.amount,
                  status: customerOrder.status,
                  length: customerOrder.foods.length + 1,
                  waiter: customerOrder.waiter.fullName,
                  modifiedDate: customerOrder.modifiedDate,
                  createdDate: customerOrder.createdDate
              };
          })
      };
      res.render('customerOrder/customerOrders', context);
    });
  }
};

//get: create customer orders
exports.getCreateCustomerOrder = function ( req, res ){
  Waiter.find({}, {}, function(err, waiters) {
    if (err) {
      console.log('Error fetching all waiters' + err.stack);
      res.send('error');
    }
    Food.find({}, {}, function(err, foods) {
      var context = {
        title: 'add customer order',
        action: '/add-customerOrder',
        foods: foods.map(function(food) {
          return {
            foodId: food._id,
            foodName: food.name
          }
        }),
        waiters: waiters.map(function(waiter) {
          return {
            waiterId: waiter._id,
            waiterName: waiter.fullName
          }
        }),
        csrfToken: req.csrfToken()
      };
      res.render('customerOrder/create-update-customerOrder', context);
    });
  });
}

// //get: update credit
// exports.getUpdateCredit = function ( req, res ){
//   Credit.findById({_id: req.params.creditId}, {}).populate('supplier', 'companyName').exec(function (err, credit) {
//       if (err) {
//           console.log('Error fetching this credit' + err.stack);
//           return false;
//       }
//       Supplier.find({}, {}, function(err, suppliers) {
//         if (err) {
//             console.log('Error fetching all credits' + err.stack);
//             res.send('error');
//         }
//         var context = {
//           title: 'update credit',
//           action: '/update-credit',
//           creditId: credit._id,
//           amount: credit.amount,
//           supplierId: credit.supplier._id,
//           companyName: credit.supplier.companyName,
//           suppliers: suppliers.map(function(supplier) {
//             return {
//               supplierId: supplier._id,
//               companyName: supplier.companyName
//             }
//           }),
//           modifiedDate: credit.modifiedDate,
//           createdDate: credit.createdDate,
//           csrfToken: req.csrfToken()
//         };
//         res.render('credit/create-update-credit', context);
//       });
//   });
// };

//create order
exports.createCustomerOrder = function (req, res) {
  const dishes = [];
  for(var i = 1; i < req.body.food.length; i++) {
    dishes.push({
      food: req.body.food[i],
      quantity: req.body.quant[i]
    });
  }
  var data = {
    table: req.body.table,
    waiter: req.body.waiter,
    foods: dishes
  };
  var customerOrder = CustomerOrder(data);
  customerOrder.save(function(err, customerOrder) {
    if (err) {
        console.log('Error creating this customer order' + err.stack);
        return res.send('error');
    }
    req.session.flash = {
      type: 'success',
      intro: 'Success!',
      message: 'customer order '  +  ' successfully added',
    };
    res.redirect(303, '/customerOrders');
  });
};

// //Update Credit
// exports.updateCredit = function (req, res) {
//   Credit.findOne({_id: req.body.creditId},{}, function (err, credit) {
//       if (err) {
//           console.log('Error fetching this credit. Ensure this credit is present' + err.stack);
//           return false;
//       }
//       if(credit) {
//         credit.amount = req.body.amount;
//         credit.supplier = req.body.supplier;
//         credit.modifiedDate = Date.now();
//         credit.save(function(err, acc) {
//           if (err) {
//               console.log('Error updating this credit' + err.stack);
//               return false;
//           }
//           req.session.flash = {
//             type: 'success',
//             intro: 'Success!',
//             message: 'Credit successfully updated',
//           };
//           res.redirect(303, 'credits');
//         });
//       } else {
//         console.log('No such credit');
//         var myFlash = {
//           type: 'danger',
//           intro: 'Error!',
//           message: 'This credit does not exist',
//         };
//         req.session.flash = myFlash;
//         res.redirect(303, '/credits');
//       }
//   });
// };

//find customerOrder by id
exports.findCustomerOrderById = function(req, res) {
  CustomerOrder.findById({_id: req.params.customerOrderId}, {}).
  populate('waiter').
  populate('foods.food').
  exec(function (err, customerOrder) {
      if (err) {
          console.log('Error fetching this customerOrder' + err.stack);
          return false;
      }
      if (customerOrder) {
        var context = {
              table: customerOrder.table,
              foods: customerOrder.foods,
              status: customerOrder.status,
              waiter: customerOrder.waiter,
              modifiedDate: customerOrder.modifiedDate,
              createdDate: customerOrder.createdDate
        };
        res.render('customerOrder/customerOrder-details', context);
      } else {
        console.log('No such customerOrder');
        var myFlash = {
          type: 'danger',
          intro: 'Error!',
          message: 'This customerOrder does not exist',
        };
        req.session.flash = myFlash;
        res.redirect(303, '/customerOrders');
      }
  });
};

//Delete customerOrder
exports.deleteCustomerOrder = function(req, res) {
  CustomerOrder.findById({_id: req.params.customerOrderId}, function (err, customerOrder) {
      if (err) {
          console.log('Error deleting this customerOrder' + err.stack);
          return false;
      }

      if(customerOrder) {
        customerOrder.remove(function(err) {
          if(err) {
            console.log('customerOrder remove error');
          }
          console.log('Successfully deleted');

          var myFlash = {
            type: 'success',
            intro: 'Success!',
            message: 'CustomerOrder successfully deleted',
          };
          if(req.xhr || req.accepts('json,html')==='json') {
             res.locals.flash = myFlash;
             res.send({success: true});
          } else {
             req.session.flash = myFlash;
             res.redirect(303, '/customerOrders');
          }
        });
      } else {
        console.log('No such customerOrder');
        var myFlash = {
          type: 'danger',
          intro: 'Error!',
          message: 'This CustomerOrder: does not exist',
        };
        req.session.flash = myFlash;
        res.redirect(303, '/customerOrders');
      }
  });
};
