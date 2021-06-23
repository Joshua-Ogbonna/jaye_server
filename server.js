const express = require('express')
const app = express()

// Import packages
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

// Use packages
app.use(morgan('dev'))
app.use(cors())
require('dotenv').config()
app.use(express.json({ extended: false }))

// Mongoose connect
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log(`Database connected successfully on ${process.env.MONGODB_URI}`)).catch(err => console.log(err))

// Routes
app.use('/api', require('./routes/auth'))

const PORT = process.env.PORT || 30000

app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`)
})
