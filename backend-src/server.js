const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, ".env");
const projectRootEnvPath = path.resolve(__dirname, "..", ".env");

const envConfigPath = fs.existsSync(envPath)
  ? envPath
  : fs.existsSync(projectRootEnvPath)
    ? projectRootEnvPath
    : undefined;

require("dotenv").config(envConfigPath ? { path: envConfigPath } : {});

const express = require("express");
const cors = require("cors");

const connectDB = require("./db");

const projectRoutes = require("./routes/projectRoutes");
const blogRoutes = require("./routes/blogRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contentRoutes = require("./routes/contentRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Shounak's Portfolio API",
  });
});

// API routes
app.use("/api/projects", projectRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/content", contentRoutes);

// 404 route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

