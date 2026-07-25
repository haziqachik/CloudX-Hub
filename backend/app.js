// Load required modules.
const express = require("express");
const path = require("path");
const session = require("express-session");

// Import application routes.
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const projectRoutes = require("./routes/project.routes");
const indexRoutes = require("./routes/index.routes");

// Create the Express application.
const app = express();

// ==============================
// View Engine Configuration
// ==============================

// Set EJS as the template engine.
app.set("view engine", "ejs");

// Specify where the EJS view files are located.
app.set("views", path.join(__dirname, "../frontend/views"));

// ==============================
// Static Files
// ==============================

// Serve CSS files.
app.use("/css", express.static(path.join(__dirname, "../frontend/css")));

// Serve JavaScript files.
app.use("/js", express.static(path.join(__dirname, "../frontend/js")));

// Serve image files.
app.use("/images", express.static(path.join(__dirname, "../frontend/images")));

// ==============================
// Middleware
// ==============================

// Parse incoming JSON requests.
app.use(express.json());

// Parse HTML form submissions.
app.use(express.urlencoded({ extended: true }));

// Configure session support.
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cloudxhub-dev-secret",
    resave: false,
    saveUninitialized: false,
  }),
);

// ==============================
// Routes
// ==============================

// Register all application routes.
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/projects", projectRoutes);
app.use("/", indexRoutes);

// ==============================
// Export
// ==============================

// Export the configured Express application.
module.exports = app;
