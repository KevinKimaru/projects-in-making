var Supplier = require('../model/supplier');
var Account = require('../model/account');
var Credit = require('../model/credit');
var SupplierOrder = require('../model/supplierOrder');
var mongoose = require('mongoose');
var Transaction = require('mongoose-transaction')(mongoose);
var SupplierInvoice = require('../model/supplierInvoice');

//fetch all suppliers
exports.fetchAllSuppliers = function (req, res) {
  Supplier.find({}, {}).populate('account').exec(function (err, suppliers) {
    if (err) {
      console.log('Error fetching all suppliers' + err.stack);
      res.send('error');
    }
    var context = {
      title: 'suppliers',
      suppliers: suppliers.map(function (supplier) {
        return {
          supplierId: supplier._id,
          companyName: supplier.companyName,
          email: supplier.email,
          phoneNumber: supplier.phoneNumber,
          address: supplier.postalAddress,
          account: supplier.account.accountName,
          accountId: supplier.account._id,
          status: supplier.status,
          modifiedDate: supplier.modifiedDate,
          createdDate: supplier.createdDate
        }
      })
    };
    res.render('supplier/suppliers', context);
  });
};

//fetch available suppliers
exports.fetchAvailableSuppliers = function (req, res) {
  Supplier.find({ status: 'activated' }, {}).populate('account').exec(function (err, suppliers) {
    if (err) {
      console.log('Error fetching all suppliers' + err.stack);
      res.send('error');
    }
    var context = {
      title: 'suppliers',
      suppliers: suppliers.map(function (supplier) {
        return {
          supplierId: supplier._id,
          companyName: supplier.companyName,
          email: supplier.email,
          phoneNumber: supplier.phoneNumber,
          address: supplier.postalAddress,
          account: supplier.account.accountName,
          accountId: supplier.account._id,
          status: supplier.status,
          modifiedDate: supplier.modifiedDate,
          createdDate: supplier.createdDate
        }
      })
    };
    res.render('supplier/suppliers', context);
  });
};

//get: create supplier
exports.getCreateSupplier = function (req, res) {
  var context = {
    title: 'add supplier',
    action: '/add-supplier',
    csrfToken: req.csrfToken()
  };
  res.render('supplier/create-update-supplier', context);
};

//get: update accounts
exports.getUpdateSupplier = function (req, res) {
  Supplier.findById({ _id: req.params.supplierId }, {}).populate('account').exec(function (err, supplier) {
    if (err) {
      console.log('Error fetching this supplier' + err.stack);
      return false;
    }
    var context = {
      title: 'update supplier',
      action: '/update-supplier',
      supplierId: supplier._id,
      companyName: supplier.companyName,
      email: supplier.email,
      phoneNumber: supplier.phoneNumber,
      address: supplier.address,
      postalCode: supplier.postalCode,
      city: supplier.city,
      accountName: supplier.account.accountName,
      accountId: supplier.account._id,
      csrfToken: req.csrfToken()
    };
    res.render('supplier/create-update-supplier', context);
  });
};

//create supplier
exports.createSupplier = function (req, res) {
  var account = Account({
    accountNumber: req.body.accountNumber,
    bank: req.body.bank,
  });
  var supplier = Supplier({
    companyName: req.body.companyName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    postalCode: req.body.postalCode,
    city: req.body.city,
    account: req.body.account,
  });
  account.save(function (err, account) {
    if (err) {
      console.log('Error saving account ' + err.stack);
      return res.send('error');
    }
    supplier.account = account._id;
    supplier.save(function (err, supplier) {
      if (err) {
        console.log('Error saving supplier ' + err.stack);
        return res.send('error');
      }
      req.session.flash = {
        type: 'success',
        intro: 'Success!',
        message: 'supplier successfully created',
      };
      res.redirect(303, 'suppliers');
    });
  });
};

//Update supplier
exports.updateSupplier = function (req, res) {
  Supplier.findById({ _id: req.body.supplierId }, {}, function (err, supplier) {
    if (err) {
      console.log('Error fetching this supplier. Ensure this supplier is present' + err.stack);
      return false;
    }
    if (supplier) {
      supplier.companyName = req.body.companyName;
      supplier.email = req.body.email;
      supplier.phoneNumber = req.body.phoneNumber;
      supplier.address = req.body.address;
      supplier.postalCode = req.body.postalCode;
      supplier.city = req.body.city;
      supplier.modifiedDate = Date.now();
      supplier.save(function (err, supplier) {
        if (err) {
          console.log('Error updating this supplier' + err.stack);
          return false;
        }
        req.session.flash = {
          type: 'success',
          intro: 'Success!',
          message: 'Supplier successfully updated',
        };
        res.send(200, { success: true });
      });
    } else {
      console.log('No such supplier');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'This supplier does not exist',
      };
      req.session.flash = myFlash;
      res.send(500, { error: true });
    }
  });
};

//find supplier by id
exports.findSupplierById = function (req, res) {
  Supplier.findById({ _id: req.query.supplier }, {}).populate('account').exec(function (err, supplier) {
    if (err) {
      console.log('Error fetching this supplier' + err.stack);
      return false;
    }
    if (supplier) {
      var context = {
        title: supplier.companyName,
        supplierId: supplier._id,
        companyName: supplier.companyName,
        email: supplier.email,
        phoneNumber: supplier.phoneNumber,
        address: supplier.address,
        postalCode: supplier.postalCode,
        city: supplier.city,
        accountNumber: supplier.account.accountNumber,
        accountId: supplier.account._id,
        bank: supplier.account.bank,
        status: supplier.status,
        modifiedDate: supplier.modifiedDate,
        createdDate: supplier.createdDate,
        csrfToken: req.csrfToken()
      };

      Credit.find({ supplier: req.query.supplier }, function (err, credits) {
        if (err) throw err;
        context.credits = credits.map(function (credit) {
          return {
            creditId: credit._id,
            amount: credit.amount,
            supplier: credit.supplier.companyName,
            modifiedDate: credit.modifiedDate,
            createdDate: credit.createdDate
          };
        });

        SupplierOrder.find({ supplier: req.query.supplier }).populate('item').exec(function (err, supplierOrders) {
          if (err) throw err;
          context.supplierOrders = supplierOrders.map(function (supplierOrder) {
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
          });


          SupplierInvoice.find({ supplier: req.query.supplier })
            .populate('').populate('').exec(function (err, supplierInvoices) {
              if (err) throw err;
              var rows = [];
              var balance = 0;
              var counter = 0;
              for (const supplierInvoice of supplierInvoices) {
                var debitAmount;
                var creditAmount;
                if (!supplierInvoice.debitAmount) {
                  debitAmount = 0;
                } else {
                  debitAmount = supplierInvoice.debitAmount;
                }
                if (!supplierInvoice.creditAmount) {
                  creditAmount = 0;
                } else {
                  creditAmount = supplierInvoice.creditAmount;
                }
                if (rows !== null) {
                  balance = balance + debitAmount - creditAmount;
                } else {
                  balance = 0;
                }
                rows[counter] = {
                  balance: balance,
                  description: supplierInvoice.description,
                  debitAmount: debitAmount,
                  creditAmount: creditAmount,
                  modifiedDate: supplierInvoice.modifiedDate,
                  createdDate: supplierInvoice.createdDate
                };
                counter++;
              }
              console.log(rows);
              // context.supplierInvoices = supplierInvoices.map(function (supplierInvoice) {
              //   return {
              //       description: supplierInvoice.description,
              //       debitAmount: supplierInvoice.debitAmount,
              //       creditAmount: supplierInvoice.creditAmount,
              //       modifiedDate: supplierInvoice.modifiedDate,
              //       createdDate: supplierInvoice.createdDate
              //   }
              // });
              context.supplierInvoices = rows;

              res.render('supplier/supplier-details', context);
            });

        });

      });
    } else {
      console.log('No such supplier');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'This supplier does not exist',
      };
      req.session.flash = myFlash;
      res.redirect(303, '/suppliers');
    }
  });
};

//Delete supplier...will delete the suppliers account as well
exports.deleteSupplier = function (req, res) {
  Supplier.findById({ _id: req.body.supplierId }).populate('account').exec(function (err, supplier) {
    if (err) {
      console.log('Error fetching this supplier' + err.stack);
      return false;
    }

    if (supplier) {
      supplier.account.remove(function (err) {
        if (err) {
          console.log('supplier account remove error');
        }
        supplier.remove(function (err) {
          if (err) {
            console.log('supplier remove error');
          }

          var myFlash = {
            type: 'success',
            intro: 'Success!',
            message: 'Supplier successfully deleted',
          };
          req.session.flash = myFlash;
          res.status(200).send({ success: true });
        });
      });
    } else {
      console.log('No such supplier');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'Supplier: does not exist',
      };
      req.session.flash = myFlash;
      res.redirect(303, '/suppliers');
    }
  });
};

//decativate supplier. This will deactivate supplier's account as well
exports.deactivateSupplier = function (req, res) {
  Supplier.findById({ _id: req.body.supplierId }).populate('account').exec(function (err, supplier) {
    if (err) {
      console.log('Error fetching this supplier' + err.stack);
      return false;
    }

    if (supplier) {
      supplier.account.status = 'deactivated';
      supplier.modifiedDate = Date.now();
      supplier.save(function (err, supplier) {
        if (err) {
          console.log('supplier deactivation error');
        }

        var myFlash = {
          type: 'success',
          intro: 'Success!',
          message: 'Supplier successfully deactivated',
        };
        req.session.flash = myFlash;
        res.status(200).send({ success: true });
      });
    } else {
      console.log('No such supplier');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'Supplier: does not exist',
      };
      req.session.flash = myFlash;
      res.redirect(303, '/suppliers');
    }
  });
};

//update suppliers account
exports.updateAccount = function (req, res) {
  console.log(req.body);
  Supplier.findById({ _id: req.body.supplierId }).populate('account').exec(function (err, supplier) {
    if (err) throw err;
    if (supplier) {
      supplier.account.accountNumber = req.body.accountNumber;
      supplier.account.bank = req.body.bank;
      supplier.modifiedDate = Date.now();
      supplier.account.save(function (err, account) {
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

exports.paySupplier = function (req, res) {
  Supplier.findById({ _id: req.body.supplierId, status: 'activated' }, function (err, supplier) {
    if (err) throw err;
    if (supplier) {
      var credit = new Credit({
        _id: mongoose.Types.ObjectId(),
        supplier: req.body.supplierId,
        amount: req.body.amount,
      });
      var supplierInvoice = new SupplierInvoice({
        supplier: req.body.supplierId,
        description: 'Progressive payment',
        credit: credit._id,
        creditAmount: req.body.amount
      });
      var transaction = new Transaction();
      transaction.insert('Credit', credit);
      transaction.insert('SupplierInvoice', supplierInvoice);
      transaction.run(function (err, docs) {
        if (err) throw err;
        var myFlash = {
          type: 'success',
          intro: 'Success!',
          message: 'Successfully paid this supplier',
        };
        req.session.flash = myFlash;
        res.send({ success: true });
      });
      // credit.save(function(err, credit) {
      //   if(err) throw err;
      //   var myFlash = {
      //     type: 'success',
      //     intro: 'Success!',
      //     message: 'Successfully paid this supplier',
      //   };
      //   req.session.flash = myFlash;
      //   res.send({success: true});
      // });
    } else {
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'This supplier does not exist',
      };
      req.session.flash = myFlash;
      res.send(500, { error: true });
    }
  });
};
