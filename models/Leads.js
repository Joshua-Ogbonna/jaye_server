const mongoose = require('mongoose')
const Schema = mongoose.Schema

const requiredString = {
  type: String,
  required: true
}

const requiredNumber = {
  type: Number,
  required: true
}

const leadsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: requiredString,
  email: requiredString,
  phone: requiredString,
  confidence: requiredNumber,
  estimatedValue: requiredNumber,
  status: requiredString,
  priority: requiredString,
  createdAt: { type: Date, default: Date.now() },
  modifiedAt: { type: Date, default: Date.now() }
})

const Leads = mongoose.model('lead', leadsSchema)
module.exports = Leads
