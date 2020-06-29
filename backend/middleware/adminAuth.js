const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const mongoose = require("mongoose");

function adminAuth(req, res, next) {
  User.findById(req.user.id)
    .then((user) => {
      if (user.role === "Admin") {
        next();
      } else {
        return res.status(401).json({ msg: "You are not allowed." });
      }
    })
    .catch((e) => res.status(500).json({ msg: "An error occured." }));
}

module.exports = adminAuth;
