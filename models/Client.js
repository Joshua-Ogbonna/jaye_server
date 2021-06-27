const mongoose = require('mongoose')
const Schema = mongoose.Schema

const requiredString = {
  type: String,
  required: true
}

const clientSchema = new Schema({
  name: requiredString,
  email: requiredString,
  phone: requiredString,
  website: requiredString,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  modifiedAt: {
    type: Date,
    default: Date.now()
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

// Export Schema
const Clients = mongoose.model('Clients', clientSchema)
module.exports = Clients
