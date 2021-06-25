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
  ]
})

const User = mongoose.model('user', userSchema)
module.exports = User
