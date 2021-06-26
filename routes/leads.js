const express = require('express')
const router = express.Router()
const Leads = require('../models/Leads')
const User = require('../models/User')
const passport = require('passport')

router.post('/create/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const newLead = new Leads({
      user: req.user,
      name: req.body.name,
      email: req.body.email,
      company: req.body.company,
      confidence: req.body.confidence,
      estimatedValue: req.body.estimatedValue,
      status: req.body.status,
      priority: req.body.priority,
      phone: req.body.phone
    })

    const user = req.user

    await newLead.save()
    const newUser = await User.findById({ _id: user._id })
    newUser.leads.push(newLead)
    await newUser.save()

    // Return new lead
    res.status(200).json({ success: true, data: newLead })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// Get leads
router.get('/leads/:id', (req, res) => {
  User.findOne({ _id: req.params.id }).populate('leads').then(leads => {
    return res.json({
      leads: leads,
      success: true
    })
  }).catch(err => {
    return res.json({ error: err })
  })
})

module.exports = router
