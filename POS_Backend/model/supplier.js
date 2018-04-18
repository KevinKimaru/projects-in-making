var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var supplierSchema = new Schema({
    companyName: {type: String, required: true},
    email: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    address: {type: String, required: true},
    postalCode: {type: String, required: true},
    city: {type: String, required: true},
    account: {type: ObjectId, ref: 'Account', required: true},
    status: {type: String, required: true, default: 'activated'},
    supplierInvoices: [{type: ObjectId, ref: 'supplierInvoiceSchema'}],
    modifiedDate: {type: Date, default: Date.now, required: true},
    createdDate: {type: Date, default: Date.now, required: true}
});

supplierSchema.virtual('postalAddress').get(function() {
  return 'P.O. Box ' + this.address + ' - ' + this.postalCode + ' ' + this.city;
});

var Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
