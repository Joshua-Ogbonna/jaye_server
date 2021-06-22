const express = require('express')
const app = express()

// Import packages
const morgan = require('morgan')
const cors = require('cors')

// Use packages
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

// Routes
app.get('/api/users', (req, res) => {
    res.json({
        name: "Joshua Ogbonna",
        occupation: "Software Developer",
        age: 24
    })
})

const PORT = process.env.PORT || 30000

app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`)
})