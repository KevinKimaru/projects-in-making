var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var supplierInvoiceSchema = new Schema({
    supplier: {type: ObjectId, required: true},
    description: {type: String, required: true},
    supplierOrder: {type: ObjectId},
    credit: {type: ObjectId},
    debitAmount: {type: Number},
    creditAmount: {type: Number},
    modifiedDate: {type: Date, default: Date.now, reqired: true},
    createdDate: {type: Date, default: Date.now, required: true}
});

var SupplierInvoice = mongoose.model('SupplierInvoice', supplierInvoiceSchema);

module.exports = SupplierInvoice;
