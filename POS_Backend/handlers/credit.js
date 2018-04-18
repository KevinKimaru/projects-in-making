var Credit = require('../model/credit');
var Supplier = require('../model/supplier');
var mongoose = require('mongoose');
var Transaction = require('mongoose-transaction')(mongoose);
var SupplierInvoice = require('../model/supplierInvoice');
var logger = require('../lib/logger')();


//fetch all credits
exports.fetchAllCredits = function (req, res, next) {
  logger.info("Fetching all credits...");
  var errors = [];
  try {
    Credit.find({}, {}).populate('supplier', 'companyName').exec(function (err, credits) {
      if (err) {
        logger.error("Fetching all credits. Finding credit", { error: err });
        return next(err);
      }
      var context = {
        title: 'credits',
        credits: credits.map(function (credit) {
          try {
            return {
              creditId: credit._id,
              supplierId: credit.supplier._id,
              amount: credit.amount,
              supplier: credit.supplier.companyName,
              modifiedDate: credit.modifiedDate,
              createdDate: credit.createdDate
            };
          } catch (err) {
            logger.error("Fetching all credits. Mapping", { errors: err });
            errors.push(err);
            return null;
          }
        })
      };
      if (errors.length > 0) {
        message = "";
        for (const error of errors) {
          message += error + "<br>";
        }
        res.locals.flash = {
          type: 'danger',
          intro: 'Error!',
          message: message,
        };
      }
      logger.info('Rendering the all credits view....');
      res.render('credit/credits', context);
    })
  } catch (err) {
    logger.error("Fetching all credits. Errors", { errors: err });
    return next(err);
  }
};

//get: create credit view
exports.getCreateCredit = function (req, res) {
  logger.info('Getting the create credit view....');
  try {
    Supplier.find({}, {}, function (err, suppliers) {
      if (err) {
        logger.error("Getting credit view. Finding supplier", { error: err });
        return next(err);
      }
      var context = {
        title: 'add credit',
        action: '/add-credit',
        suppliers: suppliers.map(function (supplier) {
          return {
            supplierId: supplier._id,
            companyName: supplier.companyName
          }
        }),
        csrfToken: req.csrfToken()
      };
      logger.info('Rendering the create credit view....');
      res.render('credit/create-update-credit', context);
    });
  } catch (err) {
    logger.error("Getting credit view. Errors", { error: err });
    return next(err);
  }
};

//create credit
exports.createCredit = function (req, res) {
  logger.info('Adding credit........');

  req.checkBody('amount', 'Amount is required').notEmpty();
  req.checkBody('amount', 'Amount should be an a number').isInt();
  req.checkBody('supplier', 'Supplier is required').notEmpty();
  req.checkBody('supplier', 'Supplier is invalid').isLength(16);
  var errors = req.validationErrors();

  if (errors.length > 0) {
    var validationErrors = '';
    for (const error of errors) {
      validationErrors += error.msg + '\n';
    }
    logger.warn('Adding credit. Invalid data submitted.', { error: validationErrors });
    req.session.flash = {
      type: 'danger',
      intro: 'Invalid!',
      message: 'Invalid data submitted. ' + validationErrors,
    };
    res.redirect(303, '/add-credit');
  } else {
    try {
      var credit = Credit({
        _id: mongoose.Types.ObjectId(),
        amount: req.body.amount,
        supplier: req.body.supplier,
      });
      var supplierInvoice = {
        supplier: req.body.supplier,
        description: 'Progressive payment',
        credit: credit._id,
        creditAmount: req.body.amount
      };
      try {
        var transaction = new Transaction();
        transaction.insert('Credit', credit);
        transaction.insert('SupplierInvoice', supplierInvoice);
        transaction.run(function (err, docs) {
          if (err) {
            logger.error('Adding credit. Error running transaction', { error: err });
            return next(err);
          }
          req.session.flash = {
            type: 'success',
            intro: 'Success!',
            message: 'Credit ' + ' successfully added',
          };
          logger.info('Succefully added credit. Redirecting to all credits...');
          res.redirect(303, '/credits');
        });
      } catch (err) {
        logger.error('Adding credit. Error level2 from transaction', { error: err });
        return next(err);
      }
    } catch (err) {
      logger.error('Adding credit. Error level1', { error: err });
      return next(err);
    }
  }
};

//Update Credit
exports.updateCredit = function (req, res) {
  logger.info('Updating credit.......');

  req.checkBody('creditId', 'The credit to update is required').notEmpty();
  req.checkBody('creditId', 'The credit is invalid').isLength(16);
  req.checkBody('amount', 'Amount is required').notEmpty();
  req.checkBody('amount', 'Amount should be a number').isInt();

  var errors = req.validationErrors();

  if (errors.length > 0) {
    var validationErrors = '';
    for (const error of errors) {
      validationErrors += error.msg + '\n';
    }
    logger.warn('Updating credit. Invalid data submitted.', { error: validationErrors });
    req.session.flash = {
      type: 'danger',
      intro: 'Invalid!',
      message: 'Invalid data submitted. ' + validationErrors,
    };
    res.status(401).send('Invalid data submitted');
  } else {

    var creditId = (req.body.creditId).trim();
    var amount = parseInt(req.body.amount);

    try {
      Credit.findById(creditId, {}, function (err, credit) {
        if (err) {
          logger.error('Updating credit. Error finding credit.', { error: err });
          return next(err);
        }
        if (credit) {
          SupplierInvoice.findOne({ credit: creditId }, (err, supplierInvoice) => {
            if (err) {
              logger.error('Updating credit. Error finding supplier invoice.', { error: err });
              return next(err);
            }
            if (supplierInvoice) {
              try {
                var transaction = new Transaction();
                transaction.update('Credit', creditId, { amount: amount, modifiedDate: Date.now() });
                transaction.update('SupplierInvoice', supplierInvoice._id, { creditAmount: amount, modifiedDate: Date.now() });
                transaction.run(function (err, docs) {
                  if (err) {
                    logger.error('Updating credit. Error running transaction.', { error: err });
                    return next(err);
                  };
                  var myFlash = {
                    type: 'success',
                    intro: 'Success!',
                    message: 'Successfully updated credit',
                  };
                  req.session.flash = myFlash;
                  logger.info('Successfull updated credit and supplier invoice.');
                  res.status(200).send({ success: true });
                });
              } catch (err) {
                logger.error('Updating credit. Transaction errors.', { error: err });
                return next(err);
              }
            } else {
              logger.warn('Updating credit. This credit\'s supplier invoice does not exist.');
              var myFlash = {
                type: 'danger',
                intro: 'Error!',
                message: 'This credit\'s  supplier invoice does not exist. ' +
                  'Your data could be corrupted. Please contact administrator.',
              };
              req.session.flash = myFlash;
              res.status(400).send('This credit\'s supplier invoice was not found');
            }
          });
        } else {
          logger.warn('Updating credit. This credit does not exist');
          var myFlash = {
            type: 'danger',
            intro: 'Error!',
            message: 'This credit does not exist',
          };
          req.session.flash = myFlash;
          res.status(400).send('Credit not found');
        }
      });
    } catch (err) {
      logger.err('Updating credit. Level 1 error', { error: err });
      return next(err);
    }
  }
};

//find credit by id
/////////////////////////////////////////////
///////THIS WILL NOT BE USED/////////////
/////////////////////////////////////
exports.findCreditById = function (req, res) {
  Credit.findById({ _id: req.query.credit }, {}).populate('supplier', 'companyName').exec(function (err, credit) {
    if (err) {
      console.log('Error fetching this credit' + err.stack);
      return false;
    }
    console.log(credit);
    if (credit) {
      var context = {
        title: 'credit',
        creditId: credit._id,
        amount: credit.amount,
        supplier: credit.supplier.companyName,
        supplierId: credit.supplier._id,
        modifiedDate: credit.modifiedDate,
        createdDate: credit.createdDate,
        csrfToken: req.csrfToken()
      };
      res.render('credit/credit-details', context);
    } else {
      console.log('No such credit');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'This credit does not exist',
      };
      req.session.flash = myFlash;
      res.redirect(303, '/credits');
    }
  });
};


//Delete credit
exports.deleteCredit = function (req, res) {
  logger.info('Deleting credit.......');

  req.checkBody('creditId', 'The credit to update is required').notEmpty();
  req.checkBody('creditId', 'The credit is invalid').isLength(16);

  var errors = req.validationErrors();

  if (errors.length > 0) {
    var validationErrors = '';
    for (const error of errors) {
      validationErrors += error.msg + '\n';
    }
    logger.warn('Deleting credit. Invalid data submitted.', { error: validationErrors });
    req.session.flash = {
      type: 'danger',
      intro: 'Invalid!',
      message: 'Invalid data submitted. ' + validationErrors,
    };
    res.status(401).send('Invalid data submitted');
  } else {
    try {
      Credit.findById({ _id: req.body.creditId }, function (err, credit) {
        if (err) {
          logger.err('Deleting credit. Error finding the credit.', { error: err });
          return next(err);
        }

        if (credit) {
          SupplierInvoice.findOne({ credit: credit._id }).exec(function (err, supplierInvoice) {
            if (err) {
              logger.error('Delete credit. Error finding this credit\'s supplierInvoice', { error: err });
              return next(err);
            }
            if (supplierInvoice) {
              try {
                var transaction = new Transaction();
                transaction.remove('SupplierInvoice', supplierInvoice._id);
                transaction.remove('Credit', credit._id);
                transaction.run(function (err, docs) {
                  if (err) {
                    logger.error('Deleting credit. Error running transaction.', {error: err});
                    return next(err);
                  };
                  var myFlash = {
                    type: 'success',
                    intro: 'Success!',
                    message: 'Credit successfully deleted',
                  };
                  req.session.flash = myFlash;
                  res.status(200).send({ success: true });
                });
              } catch (err) {
                logger.error('Deleting credit. Error in transactions.', { error: err });
                return next(err);
              }
            } else {
              var myFlash = {
                type: 'danger',
                intro: 'Error!',
                message: 'This Credit\'s invoice does not exist. Data could be corrupted.' +
                 'Please contact administrator.',
              };
              logger.warn('Delete credit. This credit\'s invoice not found.');
              req.session.flash = myFlash;
              res.status(400).send('This credit invoice not found');
            }
          });

        } else {
          var myFlash = {
            type: 'danger',
            intro: 'Error!',
            message: 'This Credit: does not exist',
          };
          logger.warn('Delete credit. This credit does not exist.');
          req.session.flash = myFlash;
          res.status(400).send('Credit not found');
        }
      });
    } catch (err) {
      logger.error('Deleting credit. Level1 error', { error: err });
      return next(err);
    }

  }
};
