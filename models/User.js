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
  products: [{ category: String, title: String, description: String }],
  sales: [
    {
      name: String,
      stage: String,
      amount: String,
      priority: String,
      owner: Object,
      type: String,
      productAssociate: Object,
      quantity: String,
      contactAssociate: Object,
      closedDate: Date
    }
  ]
})

const User = mongoose.model('User', userSchema)
module.exports = User
