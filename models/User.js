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
      Amount: String,
      Owner: Object,
      Type: String,
      productAssociate: Object,
      Quantity: String,
      contactAssociate: Object
    }
  ]
})

const User = mongoose.model('User', userSchema)
module.exports = User
