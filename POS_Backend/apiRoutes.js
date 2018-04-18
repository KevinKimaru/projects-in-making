var Food = require('./model/food');
var FoodCategory = require('./model/foodCategory');
var Employee = require('./model/employee');
var CustomerOrder = require('./model/customerOrder');

module.exports = function (app) {
    app.use('/api', require('cors')());

    app.get('/api/foods', function (req, res) {
      Food.find({}, {}).
      populate('category', '_id name').
      exec(function (err, foods) {
          if (err) {
              console.log('Error fetching all foods' + err.stack);
              return res.status(500).send('Error fetching dishes');
          }
          res.json(foods.map(function (food) {
            return {
              foodId: food._id,
              name: food.name,
              category: food.category,
              description: food.description,
              price: food.price.toString(),
              modifiedDate: food.modifiedDate,
              createdDate: food.createdDate
            }
          }));
      });
    });

    app.get('/api/foodCategories', function (req, res) {
      FoodCategory.find({}, {}, function (err, foodCategories) {
          if (err) {
              console.log('Error fetching all foodCategories' + err.stack);
              res.status(500).send('Error fetching categories');
          }
          res.json(foodCategories.map(function (foodCategory) {
                return {
                    foodCategoryId: foodCategory._id,
                    name: foodCategory.name,
                    description: foodCategory.description,
                    modifiedDate: foodCategory.modifiedDate,
                    createdDate: foodCategory.createdDate
                }
            })
          );
        });
    });

    app.get('/api/waiters', function (req, res) {
      Employee.find({position: 'waiter', status: 'activated'}, {}).populate('account').exec(function (err, employees) {
          if (err) {
              console.log('Error fetching all employees' + err.stack);
              res.status(500).send('Error fetching employees');
          }
          res.json(employees.map(function (employee) {
                return {
                  waiterId: employee._id,
                  name: employee.fullName,
                }
          }));
      });
    });

    app.post('/api/customerOrder', function (req, res) {
      const dishes = [];
      for(var i = 0; i < req.body.foods.length; i++) {
        dishes.push({
          food: req.body.foods[i].food,
          quantity: req.body.foods[i].quantity
        });
      }
      var data = {
        table: req.body.table,
        waiter: req.body.waiter,
        foods: dishes,
        amount: req.body.amount,
        createdDate: new Date(parseInt(req.body.createdDate))
      };
      var customerOrder = CustomerOrder(data);
      customerOrder.save(function(err, customerOrder) {
        if (err) {
            console.log('Error creating this customer order' + err.stack);
            return res.status(500).send('error creating this customer order');
        }
        res.status(200).send("Succeffully added order");
      });
    });
};
