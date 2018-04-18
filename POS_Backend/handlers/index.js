var CustomerOrder = require('../model/customerOrder');
var Inventory = require('../model/inventory');
var Item = require('../model/item');
var Food = require('../model/food');
var Employee = require('../model/employee');
var dates = require('../lib/dates');

exports.calculateTodaySales = function (req, res) {
    var sToday = dates.sToday;
    var sTomorrow = dates.sTomorrow;
    var sMonth = dates.sMonth;
    var sNMonth = dates.sNMonth;

    //Todays sales total
    CustomerOrder.aggregate([{
            $match: {
                createdDate: {
                    $gte: sToday,
                    $lt: sTomorrow
                }
            }
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: '$amount'
                }
            }
        },
        {
            $project: {
                _id: 0,
                total: 1
            }
        }
    ]).then(function (total) {
        var context = {};
        context.notifications = [];
        try {
            if (total[0])
                context.dailyTotal = total[0].total;
            else
                context.dailyTotal = '0000';
        } catch (err) {
            context.dailyTotal = '0000';
            console.log(err);
        }


        //Todays sales count
        CustomerOrder.aggregate([{
                $match: {
                    createdDate: {
                        $gte: sToday,
                        $lt: sTomorrow
                    }
                }
            },
            {
                $count: 'orders'
            },
        ]).then(function (count) {
            try {
                if (count[0])
                    context.dailyCount = count[0].orders;
                else
                    context.dailyCount = '0000';
            } catch (err) {
                context.dailyCount = '0000';
                console.log(err);
            }


            //This months sales total
            CustomerOrder.aggregate([{
                    $match: {
                        createdDate: {
                            $gte: sMonth,
                            $lt: sNMonth
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$amount'
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        total: 1
                    }
                }
            ]).then(function (total) {
                try {
                    if (total[0])
                        context.monthlyTotal = total[0].total;
                    else
                        context.monthlyTotal = '0000';
                } catch (err) {
                    context.monthlyTotal = '0000';
                    console.log(err);
                }


                //This months sales count
                CustomerOrder.aggregate([{
                        $match: {
                            createdDate: {
                                $gte: sMonth,
                                $lt: sNMonth
                            }
                        }
                    },
                    {
                        $count: 'orders'
                    },
                ]).then(function (count) {
                    try {
                        if (count[0])
                            context.monthlyCount = count[0].orders;
                        else
                            context.monthlyCount = '0000';
                    } catch (err) {
                        context.monthlyCount = '0000';
                        console.log(err);
                    }



                    //Inventory status
                    Inventory.find().populate('item').exec(function (err, inventories) {
                        if (err) throw err;
                        var outOfStockItems = [];
                        if (inventories) {
                            res.locals.notifications = [];
                            for (let inventory of inventories) {
                                if (inventory.quantity < inventory.item.quantity || inventory.quantity < 2) {
                                    outOfStockItems.push(inventory.item.name);
                                    res.locals.notifications.push('<p style="color: red">' + inventory.item.name + ' is out of stock</p>');
                                }
                            }
                        }
                        if (outOfStockItems.length !== 0) {
                            context.stockStatus = '<p style="color: red">Out of stock</p>';
                        } else {
                            context.stockStatus = '<p>In stock</p>';
                        }
                        context.outOfStockItems = outOfStockItems;


                        //Items Count
                        Item.aggregate([{
                            $count: 'items'
                        }, ]).then(function (count) {
                            try {
                                context.itemsCount = count[0].items;
                            } catch (err) {
                                context.itemsCount = '00';
                                console.log(err);
                            }

                            //Foods count
                            Food.aggregate([{
                                $count: 'foods'
                            }, ]).then(function (count) {
                                try {
                                    context.dishesCount = count[0].foods;
                                } catch (err) {
                                    context.dishesCount = '00';
                                    console.log(err);
                                }
                                // return res.render('index', context);
                                //Employee statistics
                                CustomerOrder.aggregate([{
                                        $match: {
                                            createdDate: {
                                                $gte: sMonth,
                                                $lt: sNMonth
                                            }
                                        }
                                    },
                                    {
                                        $group: {
                                            _id: '$waiter',
                                            total: {
                                                $sum: 1
                                            }
                                        }
                                    },
                                    {
                                        $limit: 5
                                    },
                                    {
                                        $sort: {
                                            total: -1
                                        }
                                    }
                                ]).then(function (results) {
                                    context.waitersActivity = [];
                                    if (!results.length)
                                        res.render('index', context);
                                    for (let result of results) {

                                        Employee.findById(result._id, function (err, waiter) {
                                            if (err) throw err;
                                            if (waiter) {
                                                context.waitersActivity.push({
                                                    waiter: waiter.fullName,
                                                    orders: result.total
                                                });
                                            }
                                            if (result === results[results.length - 1]) {
                                                console.log(context);
                                                res.render('index', context);
                                            }
                                        })
                                    }
                                });


                            });


                        });


                    });


                });


            });


        });


    });


};