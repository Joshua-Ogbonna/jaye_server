const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Client = require('../models/Client')
const passport = require('passport')

router.post('/client/', passport.authenticate('jwt'), async (req, res) => {
  var authUser = req.user
  try {
    const newClient = new Client({
      user: authUser,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      website: req.body.website
    })
    newClient.client = authUser._id
    await newClient.save()
    const user = await User.findById({ _id: newClient.client })
    user.clients.push(newClient)
    user.save()
    res.status(200).json({ success: true, data: newClient })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    })
  }
})

// Get Clients
router.get('/clients/:id', async (req, res) => {
  User.findOne({ _id: req.params.id })
    .populate('clients')
    .then((clients) => {
      return res.json({
        clients: clients,
        success: true
      })
    })
    .catch((err) => {
      return res.json({ error: err })
    })
})

// Get Single Client
router.get('/client/:id', async (req, res) => {
  await Client.findById({ _id: req.params.id })
    .then((client) => {
      return res.json({
        success: true,
        data: client
      })
    })
    .catch((err) => {
      return res.json({
        success: false,
        error: err.message
      })
    })
})

// Post a note
router.put('/client/:id', async (req, res) => {
  await Client.findById({ _id: req.params.id })
    .then((client) => {
      console.log(client.notes)
      client.notes.push(req.body)
      client.save()
      res.status(201).json({
        success: true,
        data: client
      })
    }).catch(err => {
      res.status(401).json({
        success: true,
        error: err.message
      })
    })
})

module.exports = router
