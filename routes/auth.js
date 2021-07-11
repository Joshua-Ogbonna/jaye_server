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
  '/product/:id',
  async (req, res) => {
    try {
      const user = await User.findById({ _id: req.params.id })
      if (user) {
        // console.log(user)
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
      } else {
        return res.json({
          message: 'user not found!'
        })
      }
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err
      })
    }
  }
)

// Create a sale
router.put('/sale/:id', async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id })
    if (user) {
      if (user.sales) {
        user.sales.push({
          name: req.body.name,
          stage: req.body.stage,
          amount: req.body.amount,
          priority: req.body.priority,
          owner: req.body.owner,
          category: req.body.category,
          productAssociate: req.body.productAssociate,
          quantity: req.body.quantity,
          contactAssociate: req.body.contactAssociate
        })
      } else {
        user.sales = [
          {
            name: String,
            stage: String,
            amount: String,
            priority: String,
            owner: Object,
            category: String,
            productAssociate: Object,
            quantity: String,
            contactAssociate: Object,
            closedDate: Date
          }
        ]
        user.sales.push({
          name: req.body.name,
          stage: req.body.stage,
          amount: req.body.amount,
          priority: req.body.priority,
          owner: req.body.owner,
          category: req.body.category,
          productAssociate: req.body.productAssociate,
          quantity: req.body.quantity,
          contactAssociate: req.body.contactAssociate,
          closedDate: req.body.closedDate
        })
      }
      await user.save()
      res.status(200).json({
        success: true
      })
    }
  } catch (err) {
    res.json({
      success: false,
      error: err
    })
  }
})

module.exports = router
