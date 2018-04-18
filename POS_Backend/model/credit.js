var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var creditSchema = new Schema({
    amount: {type: Number, required: true},
    supplier: {type: ObjectId, ref: 'Supplier', required: true},
    modifiedDate: {type: Date, default: Date.now, required: true},
    createdDate: {type: Date, default: Date.now, required: true}
});

var Credit = mongoose.model('Credit', creditSchema);

module.exports = Credit;
