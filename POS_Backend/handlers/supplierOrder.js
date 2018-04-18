var SupplierOrder = require('../model/supplierOrder');
var Supplier = require('../model/supplier');
var Item = require('../model/item');
var Inventory = require('../model/inventory');
var SupplierInvoice = require('../model/supplierInvoice');
var mongoose = require('mongoose');
var Transaction = require('mongoose-transaction')(mongoose);

//fetch all supplierOrders
exports.fetchAllSupplierOrders = function (req, res) {
  SupplierOrder.find().populate('supplier')
    .populate('item').exec(function (err, supplierOrders) {
      if (err) {
        console.log('Error fetching all supplierOrders' + err.stack);
        res.send('error');
      }
      console.log(supplierOrders);
      var context = {
        title: 'supplier orders',
        csrfToken: req.csrfToken(),
        supplierOrders: supplierOrders.map(function (supplierOrder) {
          try {
            return {
              supplierOrderId: supplierOrder._id,
              item: supplierOrder.item.name,
              itemId: supplierOrder.item._id,
              quantity: supplierOrder.quantity,
              itemPrice: supplierOrder.itemPrice,
              supplier: supplierOrder.supplier.companyName,
              supplierId: supplierOrder.supplier._id,
              modifiedDate: supplierOrder.modifiedDate,
              createdDate: supplierOrder.createdDate
            }
          } catch (err) {

          }
        })
      };
      Supplier.find(function (err, suppliers) {
        if (err) throw err;
        context.suppliers = suppliers.map(function (supplier) {
          return {
            supplier: supplier.companyName,
            supplierId: supplier._id
          }
        });

        Item.find(function (err, items) {
          if (err) throw err;
          context.items = items.map(function (item) {
            return {
              item: item.name,
              itemId: item._id
            }
          });
          res.render('supplierOrder/supplierOrders', context);
        });

      });
    });
};

//get: create supplier order
exports.getCreateSupplierOrder = function (req, res) {
  Supplier.find(function (err, suppliers) {
    if (err) {
      console.log('Error fetching suppliers' + err.stack);
      return false;
    }
    Item.find(function (err, items) {
      if (err) {
        console.log('Error fetching items' + err.stack);
        return false;
      }
      var context = {
        title: 'add supplierOrder',
        action: '/add-supplierOrder',
        suppliers: suppliers.map(function (supplier) {
          return {
            supplierId: supplier._id,
            supplierName: supplier.companyName,
          }
        }),
        items: items.map(function (item) {
          return {
            itemId: item._id,
            itemName: item.name,
          }
        }),
        csrfToken: req.csrfToken()
      };
      res.render('supplierOrder/create-update-supplierOrder', context);
    });
  });
};

//get: update supplier orders
exports.getUpdateSupplierOrder = function (req, res) {
  SupplierOrder.findById({ _id: req.params.supplierOrderId }, {}).
    populate('supplier').populate('item').exec(function (err, supplierOrder) {
      if (err) {
        console.log('Error fetching this supplier order' + err.stack);
        return false;
      }

      Supplier.find(function (err, suppliers) {
        if (err) {
          console.log('Error fetching suppliers' + err.stack);
          return false;
        }
        Item.find(function (err, items) {
          if (err) {
            console.log('Error fetching items' + err.stack);
            return false;
          }
          var context = {
            title: 'update supplierOrder',
            action: '/update-supplierOrder',
            suppliers: suppliers.map(function (supplier) {
              return {
                supplierId: supplier._id,
                supplierName: supplier.companyName,
              }
            }),
            items: items.map(function (item) {
              return {
                itemId: item._id,
                itemName: item.name,
              }
            }),
            supplierOrderId: supplierOrder._id,
            itemId: supplierOrder.item._id,
            itemName: supplierOrder.item.name,
            supplierId: supplierOrder.supplier._id,
            supplierName: supplierOrder.supplier.companyName,
            itemPrice: supplierOrder.itemPrice,
            quantity: supplierOrder.quantity,
            csrfToken: req.csrfToken()
          };
          res.render('supplierOrder/create-update-supplierOrder', context);
        });
      });
    });
};

//create supplier
exports.createSupplierOrder = function (req, res) {
  var supplierOrder = SupplierOrder({
    _id: mongoose.Types.ObjectId(),
    item: req.body.item,
    quantity: req.body.quantity,
    itemPrice: req.body.itemPrice,
    supplier: req.body.supplier
  });
  var debit = parseInt(req.body.itemPrice) * parseInt(req.body.quantity);
  var supplierInvoice = new SupplierInvoice({
    supplier: req.body.supplier,
    description: 'Supplied Order:: item: ' + req.body.item + ' quantity:  ' + req.body.quantity
      + ' ppi: ' + req.body.itemPrice,
    supplierOrder: supplierOrder._id,
    debitAmount: debit
  });
  Inventory.findOne({ item: req.body.item }, function (err, inventory) {
    var quantity = inventory.quantity;
    var newQuantity = parseInt(quantity) + parseInt(req.body.quantity);
    var transaction = new Transaction();
    transaction.insert('SupplierOrder', supplierOrder);
    transaction.insert('SupplierInvoice', supplierInvoice);
    transaction.update('Inventory', inventory._id, { quantity: newQuantity, modifiedDate: Date.now() });
    transaction.run(function (err, docs) {
      if (err) throw err;
      req.session.flash = {
        type: 'success',
        intro: 'Success!',
        message: 'supplier order successfully created',
      };
      res.status(200).send({ success: true });
    });
  });
};

//Update supplier
exports.updateSupplierOrder = function (req, res) {
  SupplierOrder.findOne({ _id: req.body.supplierOrderId }, {}, function (err, supplierOrder) {
    if (err) {
      console.log('Error fetching this supplier order. Ensure this supplier order is present' + err.stack);
      return false;
    }
    if (supplierOrder) {
      Inventory.findOne({ item: req.body.item }, function (err, inventory) {
        if (err) throw err;
        if (inventory) {
          SupplierInvoice.findOne({ supplierOrder: supplierOrder._id }, function (err, supplierInvoice) {
            if (err) throw err;
            if (supplierInvoice) {
              var creditAmount = parseInt(req.body.quantity);
              supplierInvoice.creditAmount = creditAmount;

              supplierOrder.item = req.body.item;
              supplierOrder.supplier = req.body.supplier;
              supplierOrder.quantity = req.body.quantity;
              supplierOrder.itemPrice = req.body.itemPrice;
              supplierOrder.modifiedDate = Date.now();

              var quantity = parseInt(inventory.quantity);
              var prevQuantity = parseInt(supplierOrder.quantity);
              var newQuantity = (quantity - prevQuantity) + parseInt(req.body.quantity);
              var transaction = new Transaction();

              transaction.update('SupplierOrder', supplierOrder._id, supplierOrder);
              transaction.update('SupplierInvoice', supplierInvoice._id, supplierInvoice);
              transaction.update('Inventory', inventory._id, { quantity: newQuantity, modifiedDate: Date.now() });
              transaction.run(function (err, docs) {
                if (err) throw err;
                req.session.flash = {
                  type: 'success',
                  intro: 'Success!',
                  message: 'supplier order successfully updated',
                };
                res.status(200).send({ success: true });
              });
            } else {
              console.log('No such supplieorder\'s invoice ');
              var myFlash = {
                type: 'danger',
                intro: 'Error!',
                message: 'This supplier order\'s invoice not found. Your data could be corrupted.<br>' +
                  'Please contact developer or administrator.',
              };
              req.session.flash = myFlash;
              res.status(400).send('Supplier Order\'s invoice not found');
            }
          });
        } else {
          console.log('Selected item\'s inventory does not exist ');
          var myFlash = {
            type: 'danger',
            intro: 'Error!',
            message: 'Selected item\'s inventory does not exist. Your data could be corrupted.<br>' +
              'Please contact developer or administrator.',
          };
          req.session.flash = myFlash;
          res.status(400).send('Selected item\'s inventory does not exist');
        }
      });
    } else {
      console.log('No such supplier order');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'This supplier order does not exist',
      };
      req.session.flash = myFlash;
      res.status(400).send('Supplier Order not found');
    }
  });
};

//find supplier order by id
exports.findSupplierOrderById = function (req, res) {
  SupplierOrder.findById({ _id: req.query.supplierOrder }, {}).
    populate('supplier').populate('item').exec(function (err, supplierOrder) {
      if (err) {
        console.log('Error fetching this supplier order' + err.stack);
        return false;
      }
      if (supplierOrder) {
        var context = {
          title: 'supplier order',
          supplierOrderId: supplierOrder._id,
          item: supplierOrder.item.name,
          itemId: supplierOrder.item._id,
          quantity: supplierOrder.quantity,
          itemPrice: supplierOrder.itemPrice,
          supplier: supplierOrder.supplier.companyName,
          supplierId: supplierOrder.supplier._id,
          modifiedDate: supplierOrder.modifiedDate,
          createdDate: supplierOrder.createdDate
        };
        res.render('supplierOrder/supplierOrder-details', context);
      } else {
        console.log('No such supplier order');
        var myFlash = {
          type: 'danger',
          intro: 'Error!',
          message: 'This supplier order does not exist',
        };
        req.session.flash = myFlash;
        res.redirect(303, '/supplierOrders');
      }
    });
};

//Delete supplier
exports.deleteSupplierOrder = function (req, res) {
  SupplierOrder.findById({ _id: req.body.supplierOrderId }).populate('item').exec(function (err, supplierOrder) {
    if (err) {
      console.log('Error deleting this supplier order' + err.stack);
      return false;
    }

    if (supplierOrder) {
      Inventory.findOne({ inventory: supplierOrder.item }, function (err, inventory) {
        if (err) throw err;
        if (inventory) {
          SupplierInvoice.findOne({ supplierOrder: supplierOrder._id }, function (err, supplierInvoice) {
            if (err) throw err;
            if (supplierInvoice) {
              newQuantity = parseInt(inventory.quantity) - parseInt(supplierOrder.quantity);

              transaction.remove('SupplierOrder', supplierOrder._id);
              transaction.remove('SupplierInvoice', supplierInvoice._id);
              transaction.update('Inventory', inventory._id, { quantity: newQuantity, modifiedDate: Date.now() });
              transaction.run(function (err, docs) {
                if (err) throw err;
                req.session.flash = {
                  type: 'success',
                  intro: 'Success!',
                  message: 'supplier order successfully removed',
                };
                res.status(200).send({ success: true });
              });
            } else {
              var myFlash = {
                type: 'danger',
                intro: 'Error!',
                message: 'This supplier order\'s invoice not found. Your data could be corrupted.<br>' +
                  'Please contact developer or administrator.',
              };
              req.session.flash = myFlash;
              res.status(400).send('Supplier Order\'s invoice not found');
            }
          });
        } else {
          var myFlash = {
            type: 'danger',
            intro: 'Error!',
            message: 'Selected item\'s inventory does not exist. Your data could be corrupted.<br>' +
              'Please contact developer or administrator.',
          };
          req.session.flash = myFlash;
          res.status(400).send({ error: true });
        }
      });

    } else {
      console.log('No such supplier order');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'Supplier order does not exist',
      };
      req.session.flash = myFlash;
      res.status(400).send({ error: true });
    }
  });
};
