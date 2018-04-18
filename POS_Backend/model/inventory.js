var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var inventoryScheama = new Schema({
    item: {type: ObjectId, ref: 'Item', required: true},
    quantity: {type: Number, required: true},
    modifiedDate: {type: Date, default: Date.now, required: true},
    createdDate: {type: Date, default: Date.now, required: true}
});

var Inventory = mongoose.model('Inventory', inventoryScheama);

module.exports = Inventory;
