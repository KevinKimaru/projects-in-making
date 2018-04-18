var Liability = require('../model/liability');

//fetch all liabilities
exports.fetchAllLiabilities = function (req, res) {
  Liability.find({}, {}, function (err, liabilities) {
      if (err) {
          console.log('Error fetching all liabilities' + err.stack);
          res.send('error');
      }
      var context ={
        title: 'liabilities',
        csrfToken: req.csrfToken(),
        liabilities: liabilities.map(function (liability) {
            return {
                liabilityId: liability._id,
                name: liability.name,
                description: liability.description,
                amount: liability.amount,
                modifiedDate: liability.modifiedDate,
                createdDate: liability.createdDate
            }
        })
      };
      res.render('liability/liabilities', context);
  });
};

//get: create liability
exports.getCreateLiability = function ( req, res ){
  var context = {
    title: 'create liability',
    action: '/add-liability',
    csrfToken: req.csrfToken()
  };
  res.render('liability/create-update-liability', context);
};

//get: update liability
exports.getUpdateLiability = function ( req, res ){
  Liability.findById({_id: req.params.liabilityId}, {}, function (err, liability) {
      if (err) {
          console.log('Error fetching this liability' + err.stack);
          return false;
      }
      var context = {
        title: 'update liability',
        action: '/update-liability',
        liabilityId: liability._id,
        name: liability.name,
        description: liability.description,
        amount: liability.amount,
        modifiedDate: liability.modifiedDate,
        createdDate: liability.createdDate,
        csrfToken: req.csrfToken()
      };
      res.render('liability/create-update-liability', context);
  });
};

//create liability
exports.createLiability = function (req, res) {
  var liability = Liability({
    name: req.body.name,
    description: req.body.description,
    amount: req.body.amount
  });
  liability.save(function(err, liability) {
    if (err) {
        console.log('Error updating this liability' + err.stack);
        return res.send('error');
    }
    req.session.flash = {
      type: 'success',
      intro: 'Success!',
      message: 'Liability ' + liability.name +  ' successfully created',
    };
    res.status(200).send({success: true});
  });
};

//Update Liability
exports.updateLiability = function (req, res) {
  Liability.findOne({_id: req.body.liabilityId},{}, function (err, liability) {
      if (err) {
          console.log('Error fetching this liability. Ensure this liability is present' + err.stack);
          return false;
      }
      if(liability) {
        liability.name = req.body.name;
        liability.description = req.body.description;
        liability.amount = req.body.amount;
        liability.modifiedDate = Date.now();
        liability.save(function(err, acc) {
          if (err) {
              console.log('Error updating this liability' + err.stack);
              return false;
          }
          req.session.flash = {
            type: 'success',
            intro: 'Success!',
            message: 'Liability ' + liability.name +  ' successfully updated',
          };
          res.status(200).send({success: true});
        });
      } else {
        console.log('No such liability');
        var myFlash = {
          type: 'danger',
          intro: 'Error!',
          message: 'This liability does not exist',
        };
        req.session.flash = myFlash;
        res.status(400).send({error: true});
      }
  });
};

//find liability by id
exports.findLiabilityById = function(req, res) {
  Liability.findById({_id: req.params.liabilityId}, {}, function (err, liability) {
      if (err) {
          console.log('Error fetching this liability' + err.stack);
          return false;
      }
      if (liability) {
        var context = {
          title: liability.name,
          name: liability.name,
          amount: liability.amount,
          description: liability.description,
          modifiedDate: liability.modifiedDate,
          createdDate: liability.createdDate
        };
        res.render('liability/liability-details', context);
      } else {
        console.log('No such liability');
        var myFlash = {
          type: 'danger',
          intro: 'Error!',
          message: 'This liability does not exist',
        };
        req.session.flash = myFlash;
        res.redirect(303, '/liabilities');
      }
  });
};

//Delete liability
exports.deleteLiability = function(req, res) {
  Liability.findById({_id: req.body.liabilityId}, function (err, liability) {
      if (err) {
          console.log('Error deleting this liability' + err.stack);
          return false;
      }

      if(liability) {
        liability.remove(function(err) {
          if(err) {
            console.log('liability remove error');
          }
          console.log('Successfully deleted');

          var myFlash = {
            type: 'success',
            intro: 'Success!',
            message: 'Liability successfully deleted',
          };
          req.session.flash = myFlash;
          res.status(200).send({success: true});
        });
      } else {
        console.log('No such liability');
        var myFlash = {
          type: 'danger',
          intro: 'Error!',
          message: 'Liability: ' + req.params.liabilityId + ' does not exist',
        };
        req.session.flash = myFlash;
        res.status(400).send('Liability not found');
      }
  });
};
