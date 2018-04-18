var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var customerOrderSchema = new Schema({
    table: {type: Number, required: true},
    foods: [
        {
            food: {type: ObjectId, ref: 'Food', required: true},
            quantity: {type:Number, required: true}
        }
    ],
    amount: {type: Number, required: true},
    waiter: {type: ObjectId, ref: 'Employee', required: true},
    status: {type: String, required: true, default: 'ordered'},
    modifiedDate: {type: Date, default: Date.now, required: true},
    createdDate: {type: Date, default: Date.now, required: true}
});

var CustomerOrder = mongoose.model('CustomerOrder', customerOrderSchema);

module.exports = CustomerOrder;
