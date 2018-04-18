///////////////////////////////////////////////////////////////////////////
/////THIS MODULE WAS ONLY FOR TESTING IT SHAL NOT BE USED ON PRODUCTION////
///////////////////////////////////////////////////////////////////////////


var Account = require('../model/account');

//fetch all accounts
exports.fetchAllAccounts = function (req, res, next) {
  Account.find({}, {}, function (err, accounts) {
    if (err) {
      next(err);
    }
    try {
      var context = {
        title: 'accounts',
        accounts: accounts.map(function (account) {
          return {
            accountId: account._id,
            accountNumber: account.accountNumber,
            bank: account.bank,
            modifiedDate: account.modifiedDate,
            createdDate: account.createdDate
          }
        })
      };
      res.render('account/accounts', context);
    } catch (err) {
      next(err);
    }
  });
};

//get: create account
exports.getCreateAccount = function (req, res,next) {
  try {
    var context = {
      title: 'create account',
      action: '/add-account',
      csrfToken: req.csrfToken()
    };
    res.render('account/create-update-account', context);
  } catch (err) {
    next(err);
  }
}

//get: update account
exports.getUpdateAccount = function (req, res) {
  Account.findById({ _id: req.params.accountId }, {}, function (err, account) {
    if (err) {
      console.log('Error fetching this account' + err.stack);
      return false;
    }
    var context = {
      title: 'update account',
      action: '/update-account',
      accountId: account._id,
      accountNumber: account.accountNumber,
      bank: account.bank,
      modifiedDate: account.modifiedDate,
      createdDate: account.createdDate,
      csrfToken: req.csrfToken()
    };
    res.render('account/create-update-account', context);
  });
}

//create account
exports.createAccount = function (req, res) {
  var account = Account({
    accountNumber: req.body.accountNumber,
    bank: req.body.bank
  });
  account.save(function (err, account) {
    if (err) {
      console.log('Error updating this account' + err.stack);
      return res.send('error');
    }
    req.session.flash = {
      type: 'success',
      intro: 'Success!',
      message: 'Account ' + account.accountNumber + ' successfully created',
    };
    res.redirect(303, 'accounts');
  });
},

  //Update Account
  exports.updateAccount = function (req, res) {
    Account.findOne({ _id: req.body.accountId }, {}, function (err, account) {
      if (err) {
        console.log('Error fetching this account. Ensure this account is present' + err.stack);
        return false;
      }
      if (account) {
        account.accountNumber = req.body.accountNumber;
        account.bank = req.body.bank;
        account.modifiedDate = Date.now();
        account.save(function (err, acc) {
          if (err) {
            console.log('Error updating this account' + err.stack);
            return false;
          }
          req.session.flash = {
            type: 'success',
            intro: 'Success!',
            message: 'Account ' + account.accountNumber + ' successfully updated',
          };
          res.redirect(303, 'accounts');
        });
      } else {
        console.log('No such account');
        var myFlash = {
          type: 'danger',
          intro: 'Error!',
          message: 'This account does not exist',
        };
        req.session.flash = myFlash;
        res.redirect(303, '/accounts');
      }
    });
  },

  //find account by id
  exports.findAccountById = function (req, res) {
    Account.findById({ _id: req.params.accountId }, {}, function (err, account) {
      if (err) {
        console.log('Error fetching this account' + err.stack);
        return false;
      }
      if (account) {
        var context = {
          title: account.accountNumber,
          accountNumber: account.accountNumber,
          bank: account.bank,
          modifiedDate: account.modifiedDate,
          createdDate: account.createdDate
        };
        res.render('account/account-details', context);
      } else {
        console.log('No such account');
        var myFlash = {
          type: 'danger',
          intro: 'Error!',
          message: 'This account does not exist',
        };
        req.session.flash = myFlash;
        res.redirect(303, '/accounts');
      }
    });
  };

//Delete account
exports.deleteAccount = function (req, res) {
  Account.findById({ _id: req.params.accountId }, function (err, account) {
    if (err) {
      console.log('Error deleting this account' + err.stack);
      return false;
    }

    if (account) {
      account.remove(function (err) {
        if (err) {
          console.log('account remove error');
        }

        var myFlash = {
          type: 'success',
          intro: 'Success!',
          message: 'Account successfully deleted',
        };
        if (req.xhr || req.accepts('json,html') === 'json') {
          res.locals.flash = myFlash;
          res.send({ success: true });
        } else {
          req.session.flash = myFlash;
          res.redirect(303, '/accounts');
        }
      });
    } else {
      console.log('No such account');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'Account: ' + req.params.accountId + ' does not exist',
      };
      req.session.flash = myFlash;
      res.redirect(303, '/accounts');
    }
  });
};
