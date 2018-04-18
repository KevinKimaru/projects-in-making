var Item = require('../model/item');
var Inventory = require('../model/inventory');
var mongoose = require('mongoose');
var Transaction = require('mongoose-transaction')(mongoose);

//fetch all items
exports.fetchAllItems = function (req, res) {
  Item.find({status: {$ne: 'deactivated'}}, {}, function (err, items) {
      if (err) {
          console.log('Error fetching this item' + err.stack);
          res.send('error');
      }
      var context ={
        title: 'items',
        csrfToken: req.csrfToken(),
        items: items.map(function (item) {
            return {
                itemId: item._id,
                name: item.name,
                description: item.description,
                limit: item.limit,
                units: item.units,
                price: item.price,
                modifiedDate: item.modifiedDate,
                createdDate: item.createdDate
            }
        })
      };
      res.render('item/items', context);
  });
};

//get: create item
exports.getCreateItem = function ( req, res ){
  var context = {
    title: 'create item',
    action: '/add-item',
    csrfToken: req.csrfToken()
  };
  res.render('item/create-update-item', context);
};

//get: update item
exports.getUpdateItem = function ( req, res ){
  Item.findById({_id: req.params.itemId}, {}, function (err, item) {
      if (err) {
          console.log('Error fetching this item' + err.stack);
          return false;
      }
      var context = {
        title: 'update item',
        action: '/update-item',
        itemId: item._id,
        name: item.name,
        description: item.description,
        modifiedDate: item.modifiedDate,
        createdDate: item.createdDate,
        csrfToken: req.csrfToken()
      };
      res.render('item/create-update-item', context);
  });
};

//create item
exports.createItem = function (req, res) {
  var  item = Item({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    units: req.body.units,
    price: req.body.price,
    limit: req.body.limit
  });
  var inventory = new Inventory({
    item: item._id,
    quantity: 0
  });
  var transaction = new Transaction();
  transaction.insert('Inventory', inventory);
  transaction.insert('Item', item);
  transaction.run(function(err, docs) {
    if(err) throw err;
    req.session.flash = {
      type: 'success',
      intro: 'Success!',
      message: 'Item ' + item.name +  ' successfully created and added to inventory.',
    };
    res.status(200).send({success: true});
  });
};

//Update item
exports.updateItem = function (req, res) {
  Item.findOne({_id: req.body.itemId},{}, function (err, item) {
      if (err) {
          console.log('Error fetching this item. Ensure this item is present' + err.stack);
          return false;
      }
      if(item) {
        item.name = req.body.name;
        item.price = req.body.price;
        item.limit = req.body.limit;
        item.units = req.body.units;
        item.description = req.body.description;
        item.modifiedDate = Date.now();
        item.save(function(err, acc) {
          if (err) {
              console.log('Error updating this item' + err.stack);
              return false;
          }
          req.session.flash = {
            type: 'success',
            intro: 'Success!',
            message: 'Item ' + item.name +  ' successfully updated',
          };
          res.status(200).send({success: true});
        });
      } else {
        console.log('No such item');
        var myFlash = {
          type: 'danger',
          intro: 'Error!',
          message: 'This item does not exist',
        };
        req.session.flash = myFlash;
        res.status(400).send('No such item');
      }
  });
};

//find item by id
exports.findItemById = function(req, res) {
  Item.findById({_id: req.params.itemId}, {}, function (err, item) {
      if (err) {
          console.log('Error fetching this item' + err.stack);
          return false;
      }
      if (item) {
        var context = {
          title: item.name,
          name: item.name,
          description: item.description,
          modifiedDate: item.modifiedDate,
          createdDate: item.createdDate
        };
        res.render('item/item-details', context);
      } else {
        console.log('No such item');
        var myFlash = {
          type: 'danger',
          intro: 'Error!',
          message: 'This item does not exist',
        };
        req.session.flash = myFlash;
        res.redirect(303, '/items');
      }
  });
};

//Delete item
exports.deleteItem = function(req, res) {
  Item.findById({_id: req.body.itemId}, function (err, item) {
      if (err) {
          console.log('Error deleting this item' + err.stack);
          return false;
      }

      if(item) {
        item.remove(function(err) {
          if(err) {
            console.log('item remove error');
          }
          console.log('Successfully deleted');

          var myFlash = {
            type: 'success',
            intro: 'Success!',
            message: 'Item successfully deleted',
          };
          if(req.xhr || req.accepts('json,html')==='json') {
             res.locals.flash = myFlash;
             res.send({success: true});
          } else {
             req.session.flash = myFlash;
             res.redirect(303, '/items');
          }
        });
      } else {
        console.log('No such item');
        var myFlash = {
          type: 'danger',
          intro: 'Error!',
          message: 'Item: ' + req.params.itemId + ' does not exist',
        };
        req.session.flash = myFlash;
        res.redirect(303, '/items');
      }
  });
};

//Deactvate item
exports.deactivateItem = function(req, res) {
  Item.findById({_id: req.body.itemId}, function (err, item) {
      if (err) {
          console.log('Error deleting this item' + err.stack);
          return false;
      }

      if(item) {
        item.status = 'deactivated';
        item.modifiedDate = Date.now();
        item.save(function(err, item) {
          if(err) {
            console.log('item deactivation error');
          }
          console.log('Successfully deactivated');

          var myFlash = {
            type: 'success',
            intro: 'Success!',
            message: 'Item successfully deactivated',
          };
          // if(req.xhr || req.accepts('json,html')==='json') {
          //    res.locals.flash = myFlash;
          //    res.send({success: true});
          // } else {
          //    req.session.flash = myFlash;
          //    res.redirect(303, '/items');
          // }
          req.session.flash = myFlash;
             res.status(200).send({success: true});
        });
      } else {
        console.log('No such item');
        var myFlash = {
          type: 'danger',
          intro: 'Error!',
          message: 'Item: ' + req.body.itemId + ' does not exist',
        };
        req.session.flash = myFlash;
        res.status(400).send({error: true});
      }
  });
};
