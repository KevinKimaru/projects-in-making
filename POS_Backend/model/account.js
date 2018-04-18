var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var accountSchema = new Schema({
    accountNumber: {type: String, required: true},
    bank: {type: String, required: true},
    status: {type: String, required: true, default: 'available'},
    modifiedDate: {type: Date, default: Date.now, reqired: true},
    createdDate: {type: Date, default: Date.now, required: true}
});

accountSchema.virtual('accountName').get(function() {
  return this.bank + ' ' + this.accountNumber;
});

var Account = mongoose.model('Account', accountSchema);

module.exports = Account;
