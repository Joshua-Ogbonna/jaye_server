const express = require('express')
const app = express()

// Import packages
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const passport = require('passport')

// Use packages
app.use(morgan('dev'))
app.use(cors())
require('dotenv').config()
app.use(express.json({ extended: false }))

// Use passport
app.use(passport.initialize())
require('./config/passport')(passport)

// Mongoose connect
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() =>
    console.log(`Database connected successfully on ${process.env.MONGODB_URI}`)
  )
  .catch((err) => console.log(err))

// Routes
app.use('/api', require('./routes/auth'))
app.use('/api', require('./routes/leads'))
app.use('/api', require('./routes/client'))

const PORT = process.env.PORT || 30000

app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`)
})
