const mongoose = require('mongoose')
const Schema = mongoose.Schema

const staffSchema = new Schema({
    name: String,
    email: String,
    gender: String,
    department: String,
    rank: String,
    dateOfBirth: String,
    stateOfOrigin: String,
    localGovernmentOrigin: String,
    staffCode: String,
    password: String,
    leaves: [{ name: String, staffCode: String, reason: String, message: String }],
    complaints: [{ name: String, staffCode: String, complaint: String }]
})

const Staff = mongoose.model('staff', staffSchema)

module.exports = Staff
