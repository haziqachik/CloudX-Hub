// Load required modules.
const express = require("express");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const helmet = require("helmet");

// Import database connection.
const db = require("./config/db");

// Import application routes.
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const projectRoutes = require("./routes/project.routes");
const indexRoutes = require("./routes/index.routes");

// Create the Express application.
const app = express();

// Trust AWS reverse proxy/load balancer headers.
app.set("trust proxy", 1);

// ==============================
// Security Middleware
// ==============================

// Apply secure HTTP headers.
app.use(
  helmet({
    // Disabled for now because Bootstrap is loaded from a CDN.
    // We can configure a proper Content Security Policy later.
    contentSecurityPolicy: false,
  }),
);

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
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// ==============================
// RDS MySQL Session Storage
// ==============================

// Store Express sessions inside RDS instead of server memory.
const sessionStore = new MySQLStore(
  {
    clearExpired: true,

    // Remove expired sessions every 15 minutes.
    checkExpirationInterval: 900000,

    // Session expiry time: 24 hours.
    expiration: 86400000,
  },
  db,
);

// Configure session support.
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cloudxhub-dev-secret",

    store: sessionStore,

    resave: false,

    saveUninitialized: false,

    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 86400000,
    },
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
