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
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.json({
      user: req.user,
    });
  }
);

// Post a product
router.put("/leave/:id", async (req, res) => {
  try {
    const user = await Staff.findById({ _id: req.params.id });
    if (user) {
      // console.log(user)
      if (user.leaves) {
        user.leaves.push({
          name: req.body.name,
          staffCode: req.body.staffCode,
          reason: req.body.reason,
          message: req.body.message,
        });
      } else {
        user.leaves = [
          {
            name: String,
            staffCode: String,
            reason: String,
            message: String,
            approved: { type: String, default: false },
          },
        ];
        user.leaves.push({
          name: req.body.name,
          staffCode: req.body.staffCode,
          reason: req.body.reason,
          message: req.body.message,
        });
      }
      await user.save();
      res.status(200).json({
        success: true,
      });
    } else {
      return res.json({
        message: "user not found!",
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
    });
  }
});

// Create a sale
router.put("/sale/:id", async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
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
          contactAssociate: req.body.contactAssociate,
        });
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
            closedDate: Date,
          },
        ];
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
          closedDate: req.body.closedDate,
        });
      }
      await user.save();
      res.status(200).json({
        success: true,
      });
    }
  } catch (err) {
    res.json({
      success: false,
      error: err,
    });
  }
});

// Delete product
router.delete("/product/:id/:id2", async (req, res) => {
  // console.log(req.params.id2)
  try {
    const user = await User.findById({ _id: req.params.id });
    if (user) {
      user.products.pull({ _id: req.params.id2 });
      await user.save();
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.log(err);
  }
});

// Delete sale
router.delete("/sale/:id/:id2", async (req, res) => {
  // console.log(req.params.id2)
  try {
    const user = await User.findById({ _id: req.params.id });
    if (user) {
      user.sales.pull({ _id: req.params.id2 });
      await user.save();
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
  } catch (err) {
    res.json({ err: err.message });
  }
});

module.exports = router;
