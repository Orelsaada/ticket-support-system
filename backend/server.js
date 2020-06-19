const dotenv = require("dotenv");
dotenv.config();

// Middlewares
const auth = require("./middleware/auth");
const cors = require("cors");

// Set up express
const express = require("express");
const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.connection.once("open", () => console.log("MongoDB Connected!"));

app.get("/", (req, res) => res.send("Main Page"));

app.use("/api/register", require("./routes/api/register"));
app.use("/api/auth", require("./routes/api/authenticate"));
app.use("/api/incidents", require("./routes/api/incidents"));

app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}.`)
);
