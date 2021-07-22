const express = require("express");
const router = express.Router();
const Staff = require("../models/Staff");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Post route
router.post("/newStaff", (req, res) => {
  // Get user from database
  const {
    name,
    email,
    gender,
    department,
    rank,
    dateOfBirth,
    stateOfOrigin,
    localGovernmentOrigin,
    staffCode,
    password,
  } = req.body;

  //   Check for unique user
  Staff.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        res.status(401).json({
          messatge: "User exists",
          success: false,
        });
      } else {
        // Valid user
        const newUser = new Staff({
          name,
          email,
          gender,
          department,
          rank,
          dateOfBirth,
          stateOfOrigin,
          localGovernmentOrigin,
          staffCode,
          password,
        });

        // Hash password
        bcrypt.genSalt(10, (_err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                const payload = {
                  _id: user._id,
                  email: user.email,
                  name: user.name,
                };
                jwt.sign(
                  payload,
                  process.env.SECRET,
                  { expiresIn: "365d" },
                  (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                      user: payload,
                      token: token,
                      success: true,
                    });
                  }
                );
              })
              .catch((err) => console.log(err));
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

// Login route
router.post("/staff", (req, res) => {
  Staff.findOne({ email: req.body.email })
    .then((user) => {
      // Check if there's a user
      if (!user) {
        return res.status(404).json({
          message: "user not found",
          success: false,
        });
      } else {
        bcrypt.compare(req.body.password, user.password).then((isMatch) => {
          if (isMatch) {
            const payload = {
              _id: user._id,
              name: user.name,
              email: user.email,
            };
            jwt.sign(
              payload,
              process.env.SECRET,
              { expiresIn: "365d" },
              (err, token) => {
                if (err) throw err;
                return res.status(200).json({
                  user: payload,
                  token: token,
                  success: true,
                });
              }
            );
          } else {
            return res.status(404).json({
              message: "user not found",
              success: false,
            });
          }
        });
      }
    })
    .catch((err) => {
      return res.json(err);
    });
});

// Get Profile router
router.get("/staffProfile/:id", async (req, res) => {
  try {
    const user = await Staff.findByid({ _id: req.params.id });
    if (user) {
      return res.json({
        user: user,
        success: true,
      });
    } else {
      return res.json({
        success: false,
      });
    }
  } catch (err) {
    return res.json({
      success: false,
      error: err,
    });
  }
});

module.exports = router;
