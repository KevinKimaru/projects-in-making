var FoodCategory = require('../model/foodCategory');
var Food = require('../model/food');

//fetch all food categories
exports.fetchAllfoodCategories = function (req, res) {
  FoodCategory.find({}, {},function (err, foodCategories) {
    if (err) {
      console.log('Error fetching all foodCategories' + err.stack);
      res.send('error');
    }
    console.log(foodCategories);
    var context = {
      title: 'food categories',
      foodCategories: foodCategories.map(function (foodCategory) {
        return {
          foodCategoryId: foodCategory._id,
          name: foodCategory.name,
          foods: foodCategory.foods,
          description: foodCategory.description,
          modifiedDate: foodCategory.modifiedDate,
          createdDate: foodCategory.createdDate
        }
      })
    };
    // console.log(context);
    res.render('foodCategory/foodCategories', context);
  });
};

//get: create food category
exports.getCreateFoodCategory = function (req, res) {
  var context = {
    title: 'create food category',
    action: '/add-foodCategory',
    csrfToken: req.csrfToken()
  };
  res.render('foodCategory/create-update-foodCategory', context);
};

//get: update food category
exports.getUpdateFoodCategory = function (req, res) {
  FoodCategory.findById({ _id: req.params.foodCategoryId }, {}, function (err, foodCategory) {
    if (err) {
      console.log('Error fetching this food category' + err.stack);
      return false;
    }
    var context = {
      title: 'update food category',
      action: '/update-foodCategory',
      foodCategoryId: foodCategory._id,
      name: foodCategory.name,
      description: foodCategory.description,
      csrfToken: req.csrfToken()
    };
    res.render('foodCategory/create-update-foodCategory', context);
  });
};

//create food category
exports.createFoodCategory = function (req, res) {
  var foodCategory = FoodCategory({
    name: req.body.name,
    description: req.body.description,
  });
  foodCategory.save(function (err, foodCategory) {
    if (err) {
      console.log('Error updating this food category' + err.stack);
      return res.send('error');
    }
    req.session.flash = {
      type: 'success',
      intro: 'Success!',
      message: 'Food category ' + foodCategory.name + ' successfully created',
    };
    res.redirect(303, 'foodCategories');
  });
};

//Update Food category
exports.updateFoodCategory = function (req, res) {
  FoodCategory.findOne({ _id: req.body.foodCategoryId }, {}, function (err, foodCategory) {
    if (err) {
      console.log('Error fetching this food category. Ensure this food category is present' + err.stack);
      return false;
    }
    if (foodCategory) {
      foodCategory.name = req.body.name;
      foodCategory.description = req.body.description;
      foodCategory.modifiedDate = Date.now();
      foodCategory.save(function (err, acc) {
        if (err) {
          console.log('Error updating this food category' + err.stack);
          return false;
        }
        req.session.flash = {
          type: 'success',
          intro: 'Success!',
          message: 'Food category ' + foodCategory.name + ' successfully updated',
        };
        res.redirect(303, 'foodCategories');
      });
    } else {
      console.log('No such food category');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'This food category does not exist',
      };
      req.session.flash = myFlash;
      res.redirect(303, '/foodCategories');
    }
  });
};

//find food category by id
exports.findFoodCategoryById = function (req, res) {
  FoodCategory.findById({ _id: req.params.foodCategoryId }, {}, function (err, foodCategory) {
    if (err) {
      console.log('Error fetching this food category' + err.stack);
      return false;
    }
    if (foodCategory) {
      var context = {
        title: foodCategory.name,
        name: foodCategory.name,
        description: foodCategory.description,
        modifiedDate: foodCategory.modifiedDate,
        createdDate: foodCategory.createdDate
      };
      res.render('foodCategory/foodCategory-details', context);
    } else {
      console.log('No such foodCategory');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'This foodCategory does not exist',
      };
      req.session.flash = myFlash;
      res.redirect(303, '/foodCategories');
    }
  });
};

//Delete Food category
exports.deleteFoodCategory = function (req, res) {
  FoodCategory.findById({ _id: req.params.foodCategoryId }, function (err, foodCategory) {
    if (err) {
      console.log('Error deleting this food category' + err.stack);
      return false;
    }

    if (foodCategory) {
      foodCategory.remove(function (err) {
        if (err) {
          console.log('food category remove error');
        }
        console.log('Successfully deleted');

        var myFlash = {
          type: 'success',
          intro: 'Success!',
          message: 'Food Category successfully deleted',
        };
        if (req.xhr || req.accepts('json,html') === 'json') {
          res.locals.flash = myFlash;
          res.send({ success: true });
        } else {
          req.session.flash = myFlash;
          res.redirect(303, '/foodCategories');
        }
      });
    } else {
      console.log('No such food category');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'Food Category: ' + req.params.foodCategoryId + ' does not exist',
      };
      req.session.flash = myFlash;
      res.redirect(303, '/foodCategories');
    }
  });
};
