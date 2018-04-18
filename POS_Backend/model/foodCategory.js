var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var foodCategorySchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    foods: {type: [ObjectId], ref: 'Food'},
    modifiedDate: {type: Date, default: Date.now, required: true},
    createdDate: {type: Date, default: Date.now, required: true}
});

var FoodCategory = mongoose.model('FoodCategory', foodCategorySchema);

module.exports = FoodCategory;
