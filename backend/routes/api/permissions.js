const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const User = require("../../models/user");

// Return all users without password field if auth as admin.
router.get("/users", [auth, adminAuth], (req, res) => {
  User.find()
    .select("-password")
    .then((users) => res.json(users))
    .catch((e) => console.log(e));
});

// Update user role
router.post("/update", [auth, adminAuth], (req, res) => {
  User.find({ name: req.body.user })
    .then((user) => {
      user.role = req.body.role;
      user.save();
      res.json({ msg: "User role updated." });
    })
    .catch((e) => console.log(e));
});

module.exports = router;
