var Inventory = require('../model/inventory');
var Item = require('../model/item');

//fetch all inventories
exports.fetchAllInventories = function (req, res) {
  Inventory.find({}, {}).populate('item').exec(function (err, inventories) {
      if (err) {
          console.log('Error fetching all inventories' + err.stack);
          res.send('error');
      }
      var context = {
        title: 'inventories',
        inventories: inventories.map(function (inventory) {
            return {
                inventoryId: inventory._id,
                item: inventory.item.name,
                itemId: inventory.item._id,
                quantity: inventory.quantity,
                modifiedDate: inventory.modifiedDate,
                createdDate: inventory.createdDate
            }
        })
      };
      res.render('inventory/inventories', context);
  });
};

//get: create inventory
exports.getCreateInventory = function ( req, res ){
  Item.find(function(err, items) {
    var context = {
      title: 'create inventory',
      action: '/add-inventory',
      items: items.map(function(item) {
        return {
          itemName: item.name,
          itemId: item._id
        }
      }),
      csrfToken: req.csrfToken()
    };
    res.render('inventory/create-update-inventory', context);
  });
};

//create inventory
exports.createInventory = function (req, res) {
  var inventory = Inventory({
    item: req.body.item,
    quantity: req.body.quantity
  });
  inventory.save(function(err, inventory) {
    if (err) {
        console.log('Error updating this inventory' + err.stack);
        return res.send('error');
    }
    req.session.flash = {
      type: 'success',
      intro: 'Success!',
      message: 'Inventory successfully added',
    };
    res.redirect(303, 'inventories');
  });
};

//get: update inventory
exports.getUpdateInventory = function ( req, res ){
  Inventory.findById({_id: req.params.inventoryId}, {}).populate('item').exec( function (err, inventory) {
      if (err) {
          console.log('Error fetching this inventory' + err.stack);
          return false;
      }
      Item.find(function(err, items) {
        var context = {
          title: 'update inventory',
          action: '/update-inventory',
          inventoryId: inventory._id,
          itemName: inventory.item.name,
          itemId: inventory.item._id,
          items: items.map(function(item) {
            return {
              itemName: item.name,
              itemId: item._id
            }
          }),
          quantity: inventory.quantity,
          modifiedDate: inventory.modifiedDate,
          createdDate: inventory.createdDate,
          csrfToken: req.csrfToken()
        };
        res.render('inventory/create-update-inventory', context);
      });
  });
};

//Update inventory
exports.updateInventory = function (req, res) {
  Inventory.findOne({_id: req.body.inventoryId},{}, function (err, inventory) {
      if (err) {
          console.log('Error fetching this inventory. Ensure this inventory is present' + err.stack);
          return false;
      }
      if(inventory) {
        inventory.item = req.body.item;
        inventory.quantity = req.body.quantity;
        inventory.modifiedDate = Date.now();
        inventory.save(function(err, acc) {
          if (err) {
              console.log('Error updating this inventory' + err.stack);
              return false;
          }
          req.session.flash = {
            type: 'success',
            intro: 'Success!',
            message: 'Inventory successfully updated',
          };
          res.redirect(303, 'inventories');
        });
      } else {
        console.log('No such inventory');
        var myFlash = {
          type: 'danger',
          intro: 'Error!',
          message: 'This inventory does not exist',
        };
        req.session.flash = myFlash;
        res.redirect(303, '/inventories');
      }
  });
};

//find inventory by id
exports.findInventoryById = function(req, res) {
  Inventory.findById({_id: req.params.inventoryId}, {}).populate('item').exec(function (err, inventory) {
      if (err) {
          console.log('Error fetching this inventory' + err.stack);
          return false;
      }
      if (inventory) {
        var context = {
          title: inventory.item.name,
          item: inventory.item.name,
          itemId: inventory.item._id,
          quantity: inventory.quantity,
          modifiedDate: inventory.modifiedDate,
          createdDate: inventory.createdDate
        };
        res.render('inventory/inventory-details', context);
      } else {
        console.log('No such inventory');
        var myFlash = {
          type: 'danger',
          intro: 'Error!',
          message: 'This inventory does not exist',
        };
        req.session.flash = myFlash;
        res.redirect(303, '/inventories');
      }
  });
};

//Delete inventory
exports.deleteInventory = function(req, res) {
  Inventory.findById({_id: req.params.inventoryId}, function (err, inventory) {
      if (err) {
          console.log('Error deleting this inventory' + err.stack);
          return false;
      }

      if(inventory) {
        inventory.remove(function(err) {
          if(err) {
            console.log('inventory remove error');
          }
          console.log('Successfully deleted');

          var myFlash = {
            type: 'success',
            intro: 'Success!',
            message: 'Inventory successfully deleted',
          };
          if(req.xhr || req.accepts('json,html')==='json') {
             res.locals.flash = myFlash;
             res.send({success: true});
          } else {
             req.session.flash = myFlash;
             res.redirect(303, '/inventories');
          }
        });
      } else {
        console.log('No such inventory');
        var myFlash = {
          type: 'danger',
          intro: 'Error!',
          message: 'This inventory does not exist',
        };
        req.session.flash = myFlash;
        res.redirect(303, '/inventories');
      }
  });
};
