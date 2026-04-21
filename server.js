const dns = require("dns");

// Force DNS to use Google / Cloudflare DNS
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const fs = require("fs");
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

const app = express();

// Middleware
app.use(express.json());

const corsOptions = {
  origin: true, // reflect request origin dynamically
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/assessment", require("./routes/assessmentRoutes"));
app.use("/api/attempt", require("./routes/attemptRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/rag", require("./routes/ragRoutes"));

// Base route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
