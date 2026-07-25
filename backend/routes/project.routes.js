const express = require("express");
const router = express.Router();

const {
  getProjectsPage,
  create,
} = require("../controllers/project.controller");

const ensureAuthenticated = require("../middleware/auth.middleware");

// Display all projects belonging to the logged-in user.
router.get("/", ensureAuthenticated, getProjectsPage);

// Create a new project.
router.post("/", ensureAuthenticated, create);

module.exports = router;
