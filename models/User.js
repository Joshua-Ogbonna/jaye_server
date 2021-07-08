const mongoose = require('mongoose')
const Schema = mongoose.Schema

const requiredSchema = {
  type: String,
  required: true
}

const userSchema = new Schema({
  name: requiredSchema,
  email: requiredSchema,
  password: requiredSchema,
  leads: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Leads'
    }
  ],
  clients: [{ type: Schema.Types.ObjectId, ref: 'Clients' }],
  products: [{ type: String, title: String }]
})

const User = mongoose.model('User', userSchema)
module.exports = User
