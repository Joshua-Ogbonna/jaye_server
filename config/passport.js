const JWTStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/User')
const secret = process.env.SECRET

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = secret

module.exports = (passport) => {
  passport.use(
    new JWTStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload._id)
        .then((user) => {
          if (user) return done(null, user)
          return done(null, false)
        })
        .catch((err) => {
          console.log(err)
        })
    })
  )
  passport.serializeUser((user, done) => {
    done(null, user)
  })
  passport.deserializeUser((user, done) => {
    done(null, user)
  })
}
