const express = require("express");
const app = express();

// Import packages
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

// Use packages
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
require('dotenv').config()

// Mongoose connect
mongoose.connect("process.env.MONGODB_URI", { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log(`Database connected successfully on ${process.env.MONGODB_URI}`)
});

// Routes
app.use('/api', require('./routes/auth'))

const PORT = process.env.PORT || 30000;

app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`);
});
