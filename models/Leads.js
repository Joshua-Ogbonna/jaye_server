const mongoose = require('mongoose')
const Schema = mongoose.Schema

const requiredString = {
  type: String,
  required: true
}

const leadsSchema = new Schema({
  name: requiredString,
  email: requiredString,
  phone: requiredString,
  company: requiredString,
  confidence: requiredString,
  estimatedValue: requiredString,
  status: requiredString,
  priority: requiredString,
  createdAt: { type: Date, default: Date.now() },
  modifiedAt: { type: Date, default: Date.now() }
}, {
  timestamps: true
})

leadsSchema.virtual('userLeads', {
  ref: 'User',
  localField: '_id',
  foreignField: 'leads'
})

// Set object and JSON property to true
leadsSchema.set('toObject', { virtual: true })
leadsSchema.set('toJSON', { virtual: true })

// Export schema
const Leads = mongoose.model('Leads', leadsSchema)
module.exports = Leads
