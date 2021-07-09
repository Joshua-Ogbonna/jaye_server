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
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        res.status(401).json({
          messatge: 'User exists',
          success: false
        })
      } else {
        // Valid user
        const newUser = new User({
          name,
          email,
          password
        })

        // Hash password
        bcrypt.genSalt(10, (_err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser
              .save()
              .then((user) => {
                const payload = {
                  _id: user._id,
                  email: user.email,
                  name: user.name
                }
                jwt.sign(
                  payload,
                  process.env.SECRET,
                  { expiresIn: '24h' },
                  (err, token) => {
                    if (err) throw err
                    res.status(200).json({
                      user: payload,
                      token: token,
                      success: true
                    })
                  }
                )
              })
              .catch((err) => console.log(err))
          })
        })
      }
    })
    .catch((err) => console.log(err))
})

// Login route
router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      // Check if there's a user
      if (!user) {
        return res.status(404).json({
          message: 'user not found',
          success: false
        })
      } else {
        bcrypt.compare(req.body.password, user.password).then((isMatch) => {
          if (isMatch) {
            const payload = {
              _id: user._id,
              name: user.name,
              email: user.email
            }
            jwt.sign(
              payload,
              process.env.SECRET,
              { expiresIn: '24h' },
              (err, token) => {
                if (err) throw err
                return res.status(200).json({
                  user: payload,
                  token: token,
                  success: true
                })
              }
            )
          } else {
            return res.status(404).json({
              message: 'user not found',
              success: false
            })
          }
        })
      }
    })
    .catch((err) => {
      return res.json(err)
    })
})

// Get Profile router
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    return res.json({
      user: req.user
    })
  }
)

// Post a product
router.put(
  '/product',
  passport.authenticate('jwt'),
  async (req, res) => {
    try {
      const user = req.user
      if (user.products) {
        user.products.push({
          category: req.body.category,
          title: req.body.title,
          description: req.body.description
        })
      } else {
        user.products = [{ category: String, title: String, description: String }]
        user.products.push({
          category: req.body.category,
          title: req.body.title,
          description: req.body.description
        })
      }
      await user.save()
      res.status(200).json({
        success: true
      })
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err
      })
    }
  }
)

module.exports = router
