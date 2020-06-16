const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });
const User = require("../../models/user");
const auth = require("../../middleware/auth");

// POST /api/auth
router.post("/", (req, res) => {
  const { email, password } = req.body;

  // Validate that there's data
  if (!email || !password)
    return res.status(400).json({ msg: "Please enter all fields." });

  // Check if there is an existing user:
  //  Exist ? return token with user info.  Not exist? return message.
  User.findOne({ email }).then((user) => {
    if (!user) return res.status(400).json({ msg: "User doesn't exist." });

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch)
        return res.status(400).json({ msg: "Invalid Credentials." });

      jwt.sign(
        { id: user.id },
        process.env.jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;

          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
        }
      );
    });
  });
});

// GET /api/auth/user
router.get("/user", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then((user) => res.json(user));
});

module.exports = router;
