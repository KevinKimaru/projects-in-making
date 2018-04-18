var Food = require('../model/food');
var FoodCategory = require('../model/foodCategory');

//fetch all foods
exports.fetchAllFoods = function (req, res) {
  Food.find({status: {$ne : 'deactivated'}}, {}).
    populate('category').
    exec(function (err, foods) {
      if (err) {
        console.log('Error fetching all foods' + err.stack);
        res.send('error');
      }
      var context = {
        title: 'foods',
        csrfToken: req.csrfToken(),
        foods: foods.map(function (food) {
          return {
            foodId: food._id,
            name: food.name,
            category: food.category,
            description: food.description,
            price: food.price,
            modifiedDate: food.modifiedDate,
            createdDate: food.createdDate
          }
        })
      };
      FoodCategory.find(function (err, foodCategories) {
        if (err) throw err;
        if (foodCategories) {
          context.foodCategories = foodCategories.map(function (foodCategory) {
            return {
              categoryId: foodCategory._id,
              categoryName: foodCategory.name
            };
          });
        }
        res.render('food/foods', context);
      });
    });
};

//get: create food
exports.getCreateFood = function (req, res) {
  FoodCategory.find({}, {}, function (err, foodCategories) {
    if (err) {
      console.log("Error while fetching food categories " + err.stack);
      return false;
    }
    var context = {
      title: 'add food',
      action: '/add-food',
      foodCategories: foodCategories.map(function (foodCategory) {
        return {
          categoryName: foodCategory.name,
          categoryId: foodCategory._id
        }
      }),
      csrfToken: req.csrfToken()
    };
    res.render('food/create-update-food', context);
  });
};

//get: update food
exports.getUpdateFood = function (req, res) {
  Food.findById({ _id: req.params.foodId }, {}).
    populate('category').
    exec(function (err, food) {
      if (err) {
        console.log('Error fetching this food' + err.stack);
        return false;
      }
      FoodCategory.find(function (err, categories) {
        var context = {
          title: 'update food',
          action: '/update-food',
          foodId: food._id,
          name: food.name,
          foodCategories: categories.map(function (category) {
            return {
              categoryId: category._id,
              categoryName: category.name
            }
          }),
          description: food.description,
          price: food.price,
          categoryName: food.category.name,
          categoryId: food.category._id,
          csrfToken: req.csrfToken()
        };
        res.render('food/create-update-food', context);
      });
    });
}

//create food
exports.createFood = function (req, res) {
  var food = Food({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price
  });
  food.save(function (err, food) {
    if (err) {
      console.log('Error updating this food' + err.stack);
      return res.send('error');
    }
    FoodCategory.findById({_id: food.category}, function(err, foodCategory) {
      if(err) throw err;
      if(foodCategory) {
        foodCategory.foods.push(food._id);
        foodCategory.modifiedDate = new Date();
        foodCategory.save(function(err, foodCategory) {
          if(err) throw err;
          req.session.flash = {
            type: 'success',
            intro: 'Success!',
            message: 'Dish ' + food.name + ' successfully added',
          };
          res.status(200).send({success: true});
        });
      }else {
        return false;
      }
    });
  });
};

//Update food
exports.updateFood = function (req, res) {
  Food.findOne({ _id: req.body.foodId }, {}, function (err, food) {
    if (err) {
      console.log('Error fetching this food. Ensure this food  is present' + err.stack);
      return false;
    }
    if (food) {
      food.name = req.body.name;
      food.description = req.body.description;
      food.price = req.body.price;
      food.category = req.body.category;
      food.modifiedDate = Date.now();
      food.save(function (err, acc) {
        if (err) {
          console.log('Error updating this food' + err.stack);
          return false;
        }
        req.session.flash = {
          type: 'success',
          intro: 'Success!',
          message: 'Dish: ' + food.name + ' successfully updated',
        };
        res.status(200).send({ success: true });
      });
    } else {
      console.log('No such food');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'This dish does not exist',
      };
      req.session.flash = myFlash;
      res.status(400).send('No such food');
    }
  });
};

//find food by id
exports.findFoodById = function (req, res) {
  Food.findById({ _id: req.query.food }, {}).
    populate('category').
    exec(function (err, food) {
      if (err) {
        console.log('Error fetching this food' + err.stack);
        return false;
      }
      if (food) {

        var context = {
          title: food.name,
          name: food.name,
          description: food.description,
          price: food.price,
          category: food.category.name,
          categoryId: food.category._id,
          modifiedDate: food.modifiedDate,
          createdDate: food.createdDate
        };
        res.render('food/food-details', context);
      } else {
        console.log('No such food');
        var myFlash = {
          type: 'danger',
          intro: 'Error!',
          message: 'This food does not exist',
        };
        req.session.flash = myFlash;
        res.redirect(303, '/foods');
      }
    });
};

//Delete food
exports.deleteFood = function (req, res) {
  Food.findById({ _id: req.body.foodId }, function (err, food) {
    if (err) {
      console.log('Error deleting this food' + err.stack);
      return false;
    }

    if (food) {
      food.remove(function (err) {
        if (err) {
          console.log('food remove error');
        }
        var myFlash = {
          type: 'success',
          intro: 'Success!',
          message: 'Food successfully deleted',
        };
        req.session.flash = myFlash;
        res.send(200, { success: true });
      });
    } else {
      console.log('No such food');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'Food: ' + req.params.foodId + ' does not exist',
      };
      req.session.flash = myFlash;
      res.send(401, { error: true });
    }
  });
};

exports.deactivateFood = function (req, res) {
  Food.findById({ _id: req.body.foodId }, function (err, food) {
    if (err) {
      console.log('Error finding this food' + err.stack);
      return false;
    }

    if (food) {
      food.status = 'deactivated';
      food.modifiedDate = Date.now();
      food.save(function (err, food) {
        if (err) {
          console.log('food deactivation error');
        }
        console.log(food);
        var myFlash = {
          type: 'success',
          intro: 'Success!',
          message: 'Food successfully deleted',
        };
        req.session.flash = myFlash;
        res.send(200, { success: true });
      });
    } else {
      console.log('No such food');
      var myFlash = {
        type: 'danger',
        intro: 'Error!',
        message: 'Food: ' + req.params.foodId + ' does not exist',
      };
      req.session.flash = myFlash;
      res.send(401, { error: true });
    }
  });
};
