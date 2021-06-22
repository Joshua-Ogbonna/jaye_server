const express = require("express");
const router = express.Router();

router.get("/user", (req, res) => {
  res.json({
    name: "Joshua Ogbonna",
    occupation: "Software Developer",
    age: 24,
  });
});

module.exports = router;
