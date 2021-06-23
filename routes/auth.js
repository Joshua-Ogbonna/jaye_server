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
            const payload = {
              _id: user._id,
              email: user.email,
              name: user.name
            }
            jwt.sign(payload, process.env.SECRET, { expiresIn: '24h' }, (err, token) => {
              if (err) throw err
              res.status(200).json({
                data: payload,
                token: `Token: ${token}`
              })
            })
          }).catch(err => console.log(err))
        })
      })
    }
  }).catch(err => console.log(err))
})

// Login route
router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    // Check if there's a user
    if (!user) {
      return res.status(404).json({
        message: 'user not found',
        success: false
      })
    } else {
      bcrypt.compare(req.body.password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = {
            _id: user._id,
            name: user.name,
            email: user.email
          }
          jwt.sign(payload, process.env.SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err
            return res.status(200).json({
              data: payload,
              token: `Toke ${token}`
            })
          })
        } else {
          return res.status(404).json({
            message: 'user not found',
            success: false
          })
        }
      })
    }
  }).catch(err => {
    return res.json(err)
  })
})

module.exports = router
