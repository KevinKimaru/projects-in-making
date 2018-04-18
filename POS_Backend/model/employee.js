var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var employeeSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    idNumber: {type: String, required: true},
    email: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    address: {type: String, required: true},
    postalCode: {type: String, required: true},
    city: {type: String, required: true},
    account: {type: ObjectId, ref: 'Account'},
    role: {type: String, required: true},
    password: {type: String, required: true, default: '1234'},
    position: {type: String, required: true},
    status: {type: String, required: true, default: 'activated'},
    modifiedDate: {type: Date, default: Date.now, required: true},
    createdDate: {type: Date, default: Date.now, required: true}
});

employeeSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName + ' ' + this.idNumber;
});

employeeSchema.virtual('postalAddress').get(function() {
  return 'P.O. Box ' + this.address + ' - ' + this.postalCode + ' ' + this.city;
});

employeeSchema.virtual('fullName2').get(function() {
  return this.firstName + ' ' + this.lastName;
});

var Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
