const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  userId: { required: true, type: String },
  title: { required: true, type: String },
  description: { type: String },
});

const Incident = mongoose.model("Incident", incidentSchema);

module.exports = Incident;
