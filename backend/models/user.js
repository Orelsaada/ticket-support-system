const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { required: true, type: String },
  email: { required: true, type: String, unique: true },
  password: { required: true, type: String },
  role: { required: true, type: String, default: "User" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
