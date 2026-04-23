const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// routes
const profileRoutes = require("./routes/profile.routes");
const searchRoutes = require("./routes/search.routes");

// mount routes
app.use("/api/profiles", profileRoutes);              // filtering + pagination
app.use("/api/profiles/search", searchRoutes);        // NLP search

// health check
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Intelligence Engine API is running 🚀"
  });
});

module.exports = app;