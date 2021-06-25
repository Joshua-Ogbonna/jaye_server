const express = require('express')
const router = express.Router()
const Leads = require('../models/Leads')
const User = require('../models/User')

router.post('/create/:id', (req, res) => {
  const userId = req.params.id
  if (userId === null) {
    return res.json({ message: 'Invalid user Id' })
  } else {
    Leads.create(req.body)
      .then((lead) => {
        return User.findOneAndUpdate(
          { _id: userId },
          { $push: { leads: lead._id } },
          { new: true }
        )
      })
      .then((newLead) => {
        return res.json({
          message: 'lead added successfully',
          lead: newLead
        })
      })
      .catch((err) => {
        res.json({ error: err.errors })
      })
  }
})

module.exports = router
