var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

//any expenses made other than
var liabilitiesSchema = new Schema({
    name: {type:String, required: true},
    description: {type:String, required: true},
    amount: {type:Number, required: true},
    modifiedDate: {type: Date, default: Date.now, required: true},
    createdDate: {type: Date, default: Date.now, required: true}
});

var Liability = mongoose.model('Liability', liabilitiesSchema);

module.exports = Liability;
