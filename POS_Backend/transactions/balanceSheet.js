var Liabilities = require('../model/liabilities');
var SupplierOrders = require('../model/supplierOrder');
var CustomerOrders = require('../model/customerOrder');


function totalLiabilities(startDate, endDate) {
    var liabilitiesSum = Liabilities.aggregate([{
        $match: {createdDate: {$gte: startDate, $lte: endDate}}
    },{$group: {_id: null, total: {$sum: '$amount'}}}], function(err, liabilitiesSum) {
        console.log('\n\n\n================================');
        console.log(liabilitiesSum);
        console.log('================================\n\n\n');
    });
    var liabilities = Liabilities.find({
        createdDate: {$gte: startDate, $lte: endDate}
    }, function(err, liabilities) {
        console.log('\n\n\n================================');
        console.log(liabilities);
        console.log('================================\n\n\n');
    });
}


function totalSupplierOrders(startDate, endDate) {
    return {
        supplierOrders: SupplierOrders.find({
            createdDate: {$gte: startDate, $lte: endDate}
        }, function(err, supplierOrders) {
            console.log('\n\n\n================================');
            console.log(supplierOrders);
            console.log('================================\n\n\n');
        }),

        suppliersOrdersSum: SupplierOrders.aggregate([{
            $match: {createdDate: {$gte: startDate, $lte: endDate}}
        }, {$group: {_id: null, total: {$sum: {$multiply: ['$quantity', '$itemPrice']}}}}], function(err, suppliersOrdersSum) {
            console.log('\n\n\n================================');
            console.log(suppliersOrdersSum);
            console.log('================================\n\n\n');
        })
    };
//aws rh android
}
