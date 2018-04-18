var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var todoSchema = new Schema({
    todo: {type: String},
    done: {type: Number},
    modifiedDate: {type: Date, default: Date.now, required: true},
    createdDate: {type: Date, default: Date.now, required: true}
});

var Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
