const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const Incident = require("../../models/incident");

// POST /api/incidents/new
router.post("/new", auth, (req, res) => {
  const { userId, userName, title, description, sd } = req.body;

  // Validate there's user connected.
  if (!userId) return res.status(400).json({ msg: "Please login.." });

  // Create new incident.
  const incident = new Incident({
    userId,
    userName,
    title,
    description,
    sd,
  });
  incident.save().then(res.json({ msg: "Incident created successfuly." }));
});

// GET /api/incidents
router.get("/", auth, (req, res) => {
  Incident.find({ userId: req.user.id })
    .select("-__v")
    .then((incidents) => res.json(incidents));
});

// GET /api/incidents/sd
router.get("/sd", auth, (req, res) => {
  Incident.find().then((incidents) => {
    res.json({ totalIncidents: incidents.length });
  });
});

// GET /api/incidents/admin
router.get("/admin", [auth, adminAuth], (req, res) => {
  Incident.find()
    .select("-__v")
    .then((incidents) => res.json(incidents));
});

// DELETE /api/incidents/delete
router.delete("/delete", auth, (req, res) => {
  Incident.findByIdAndDelete(req.body.id)
    .then(() => res.json({ msg: "Incident deleted successfuly." }))
    .catch((err) => res.json({ error: err }));
});

// POST /api/incidents/close
router.post("/close", auth, (req, res) => {
  Incident.findById(req.body.id)
    .then((incident) => {
      incident.status = "Closed";
      incident.save(() => res.json({ msg: "Incident Closed." }));
    })
    .catch((err) => res.json({ error: err }));
});

module.exports = router;
