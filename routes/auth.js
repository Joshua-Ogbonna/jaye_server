const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

// Post route
router.post('/signup', (req, res) => {
  // Get user from database
  const { name, email, password } = req.body

  //   Check for unique user
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      res.status(401).json({
        messatge: 'User exists'
      })
    } else {
      // Valid user
      const newUser = new User({
        name, email, password
      })

      // Hash password
      bcrypt.genSalt(10, (_err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser.save().then(user => {
            res.status(201).json({
              message: 'user registered successfully',
              data: user
            })
          }).catch(err => console.log(err))
        })
      })
    }
  }).catch(err => console.log(err))
})

module.exports = router
