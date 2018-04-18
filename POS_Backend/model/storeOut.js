var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var storeOutSchema = new Schema({
    item: {type: ObjectId, ref: 'Item', required: true},
    quantity: {type: Number, required: true},
    modifiedDate: {type: Date, default: Date.now},
    createdDate: {type: Date, default: Date.now}
});

var StoreOut = mongoose.model('StoreOut', storeOutSchema);

module.exports = StoreOut;
