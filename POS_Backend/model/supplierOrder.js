var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var supplierOrderSchema = new Schema({
    item: {type: ObjectId, required: true, ref: 'Item'},
    quantity: {type: Number, required: true},
    itemPrice: {type: Number, required: true},
    supplier: {type: ObjectId, required: true, ref: 'Supplier'},
    modifiedDate: {type: Date, default: Date.now, required: true},
    createdDate: {type: Date, default: Date.now, required: true}
});

var SupplierOrder = mongoose.model('SupplierOrder', supplierOrderSchema);

module.exports = SupplierOrder;
