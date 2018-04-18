var StoreOut = require('../model/storeOut');
var Item = require('../model/item');
var Inventory = require('../model/inventory');
var mongoose = require('mongoose');
var Transaction = require('mongoose-transaction')(mongoose);

//fetch all storeOuts
exports.fetchAllStoreOuts = function (req, res) {
  StoreOut.find({}, {}).populate('item').exec(function (err, storeOuts) {
    if (err) {
      console.log('Error fetching all store outs' + err.stack);
      res.send('error');
    }
    Item.find(function (err, items) {
      if (err) throw err;
      var context = {
        title: 'store outs',
        csrfToken: req.csrfToken(),
        storeOuts: storeOuts.map(function (storeOut) {
          return {
            storeOutId: storeOut._id,
            itemId: storeOut.item._id,
            itemName: storeOut.item.name,
            quantity: storeOut.quantity,
            modifiedDate: storeOut.modifiedDate,
            createdDate: storeOut.createdDate
          }
        })
      };
      context.items = items.map(function (item) {
        return {
          itemId: item._id,
          itemName: item.name
        }
      });
      res.render('storeOut/storeOuts', context);
    });
  });
};

//get: create store out
exports.getCreateStoreOut = function (req, res) {
  Inventory.find().populate('item').exec(function (err, inventories) {
    if (err) {
      console.log('Error fetching inventories' + err.stack);
      return false;
    }
    var context = {
      title: 'add item out',
      action: '/add-storeOut',
      inventories: inventories.map(function (inventory) {
        return {
          itemId: inventory.item._id,
          itemName: inventory.item.name,
          quantity: inventory.quantity,
        }
      }),
      csrfToken: req.csrfToken()
    };
    res.render('storeOut/create-update-storeOut', context);
  });
};

//get: update storeOut
exports.getUpdateStoreOut = function (req, res) {
  StoreOut.findById({ _id: req.params.storeOutId }, {}).populate('item').exec(function (err, storeOut) {
    if (err) {
      console.log('Error fetching this store out' + err.stack);
      return false;
    }
    Item.find(function (err, items) {
      if (err) {
        console.log('Error fetching this storeOut' + err.stack);
        return false;
      }
      var context = {
        title: 'update storeOut',
        action: '/update-storeOut',
        storeOutId: storeOut._id,
        itemId: storeOut.item._id,
        itemName: storeOut.item.name,
        quantity: storeOut.quantity,
        items: items.map(function (item) {
          return {
            itemId: item._id,
            itemName: item.name,
          }
        }),
        modifiedDate: storeOut.modifiedDate,
        createdDate: storeOut.createdDate,
        csrfToken: req.csrfToken()
      };
      res.render('storeOut/create-update-storeOut', context);
    });
  });
};

//create storeOut
exports.createStoreOut = function (req, res) {
  Inventory.findOne({ item: req.body.itemId }, function (err, inventory) {
    if (inventory) {
      var quantity = parseInt(inventory.quantity);
      var newQuantity = quantity - parseInt(req.body.quantity);
      if (newQuantity <= 0) {
        newQuantity = 0;
      }
      var nstoreOut = new StoreOut({
        _id: mongoose.Types.ObjectId(),
        item: req.body.itemId,
        quantity: req.body.quantity
      });
      var transaction = new Transaction();
      transaction.insert('StoreOut', nstoreOut);
      transaction.update('Inventory', inventory._id, { quantity: newQuantity });
      transaction.run(function (err, docs) {
        if (err) throw err;
        req.session.flash = {
          type: 'success',
          intro: 'Success!',
          message: 'storeOut successfully created',
        };
        res.status(200).send({ success: true });
      });
    } else {
      req.session.flash = {
        type: 'danger',
        intro: 'Error!',
        message: 'This item\'s inventory does not exist. Your data could be corrupted. ',
      };
      res.status(400).send({ success: true });
    }
  });
};

//Update storeOut
exports.updateStoreOut = function (req, res) {
  StoreOut.findOne({ _id: req.body.storeOutId }, {}, function (err, storeOut) {
    if (err) {
      console.log('Error fetching this storeOut. Ensure this storeOut is present' + err.stack);
      return false;
    }
    if (storeOut) {
      var nStoreOut = {
        item: req.body.itemId,
        quantity: req.body.quantity,
        modifiedDate: Date.now()
      };
      Inventory.findOne({ item: storeOut.item }, function (err, inventory) {
        if (err) throw err;
        if (inventory) {
          var quantity = parseInt(inventory.quantity);
          var prevQuantity = quantity - parseInt(storeOut.quantity);
          var newQuantity = prevQuantity + parseInt(req.body.quantity);
          if (newQuantity <= 0) {
            newQuantity = 0;
          }
          var transaction = new Transaction();
          transaction.update('StoreOut', storeOut._id, nStoreOut);
          transaction.update('Inventory', inventory._id, { quantity: newQuantity });
          transaction.run(function (err, docs) {
            if (err) throw err;
            req.session.flash = {
              type: 'success',
              intro: 'Success!',
              message: 'Store Out successfully updated',
            };
            res.status(200).send({ success: true });
          });
        } else {
          console.log('No such inventory');
          var myFlash = {
            type: 'danger',
            intro: 'Error!',
            message: 'This inventory does not exist',
          };
          req.session.flash = myFlash;
          res.status(400).send('No such inventory');
        }
      });
    } else {
      console.log('No such storeOut');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'This store Out does not exist',
      };
      req.session.flash = myFlash;
      res.status(400).send('No such store out');
    }
  })
};

//find storeOut by id
exports.findStoreOutById = function (req, res) {
  StoreOut.findById({ _id: req.params.storeOutId }, {}).populate('item').exec(function (err, storeOut) {
    if (err) {
      console.log('Error fetching this storeOut' + err.stack);
      return false;
    }
    if (storeOut) {
      var context = {
        title: storeOut.name,
        itemName: storeOut.item.name,
        itemId: storeOut.item._id,
        quantity: storeOut.quantity,
        modifiedDate: storeOut.modifiedDate,
        createdDate: storeOut.createdDate
      };
      res.render('storeOut/storeOut-details', context);
    } else {
      console.log('No such storeOut');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'This storeOut does not exist',
      };
      req.session.flash = myFlash;
      res.redirect(303, '/storeOuts');
    };
});
};

//Delete storeOut
exports.deleteStoreOut = function (req, res) {
  StoreOut.findById({ _id: req.body.storeOutId }, function (err, storeOut) {
    if (err) {
      console.log('Error deleting this storeOut' + err.stack);
      return false;
    }

    if (storeOut) {
      Inventory.findOne({ item: storeOut.item }, function (err, inventory) {
        if (err) throw err;
        if (inventory) {
          var quantity = parseInt(inventory.quantity);
          var newQuantity = quantity - parseInt(storeOut.quantity);
          if (newQuantity <= 0) {
            newQuantity = 0;
          }
          var transaction = new Transaction();
          transaction.remove('StoreOut', storeOut._id);
          transaction.update('Inventory', inventory._id, { quantity: newQuantity });
          transaction.run(function (err, docs) {
            if (err) throw err;
            req.session.flash = {
              type: 'success',
              intro: 'Success!',
              message: 'Store Out successfully updated',
            };
            res.status(200).send({ success: true });
          });
        } else {
          console.log('No such inventory');
          var myFlash = {
            type: 'danger',
            intro: 'Error!',
            message: 'This inventory does not exist',
          };
          req.session.flash = myFlash;
          res.status(400).send('No such inventory');
        }
      });
    } else {
      console.log('No such storeOut');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'Store Out: does not exist',
      };
      req.session.flash = myFlash;
      res.status(400).send('No such store out');
    }
  });
};
