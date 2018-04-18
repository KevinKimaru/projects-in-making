var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var itemSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    price: {type: Number, required: true},
    units: {type: String, required: true},
    limit: {type: Number, required: true},
    status: {type: String, required: true, default: 'activated'},
    modifiedDate: {type: Date, default: Date.now, required: true},
    createdDate: {type: Date, default: Date.now, required: true}
});

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;
