var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var foodSchema = new Schema({
    name: {type: String, required: true},
    category: {type: String, ref: 'FoodCategory', required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    status: {type: String, required: true, default: 'activated'},
    modifiedDate: {type: Date, default: Date.now, required: true},
    createdDate: {type: Date, default: Date.now, required: true}
});

var Food = mongoose.model('Food', foodSchema);

module.exports = Food;
