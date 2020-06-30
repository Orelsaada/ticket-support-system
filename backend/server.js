const dotenv = require("dotenv");
dotenv.config();
const path = require("path");

// Middlewares
const auth = require("./middleware/auth");
const cors = require("cors");

// Set up express
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));

// Connect to MongoDB
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.connection.once("open", () => console.log("MongoDB Connected!"));

// Serve static assets if in production
if (process.nextTick.NODE_ENV === "production") {
  app.use(express.static("../frontend/ticket-system/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname));
  });
}

app.use("/api/register", require("./routes/api/register"));
app.use("/api/auth", require("./routes/api/authenticate"));
app.use("/api/incidents", require("./routes/api/incidents"));
app.use("/api/permissions", require("./routes/api/permissions"));

app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}.`)
);
