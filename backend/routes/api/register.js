const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });
const User = require("../../models/user");

// POST /api/register
router.post("/", (req, res) => {
  const { name, email, password } = req.body;

  // Validate that there's data
  if (!name || !email || !password)
    return res.status(400).json({ msg: "Please enter all fields." });

  // Check if there is an existing user:
  //  Exist ? return message.  Not exist? save user with hashed password.
  User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ msg: "User already exists." });
    const newUser = new User({ name, email, password });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        newUser.password = hash;
        newUser.save((err, data) => {
          if (err) throw err;
          jwt.sign(
            { id: newUser.id },
            process.env.jwtSecret,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;

              res.json({
                token,
                user: {
                  id: data.id,
                  name: data.name,
                  email: data.email,
                },
              });
            }
          );
        });
      });
    });
  });
});

module.exports = router;
