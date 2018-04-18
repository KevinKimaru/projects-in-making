var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var salarySchema = new Schema({
    employee: {type: ObjectId, ref: 'Employee', required: true},
    amount: {type: Number, required: true},
    sMonth: {type: String, required: true},
    sYear: {type: Number, required: true},
    modifiedDate: {type: Date, default: Date.now, required: true},
    createdDate: {type: Date, default: Date.now, required: true}
});

var Salary = mongoose.model('Salary', salarySchema);

module.exports = Salary;
