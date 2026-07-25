const express = require("express");
const router = express.Router();

const {
  getProjectsPage,
  create,
} = require("../controllers/project.controller");

const { requireAuth } = require("../middleware/auth.middleware");

// Display all projects belonging to the logged-in user.
router.get("/", requireAuth, getProjectsPage);

// Create a new project.
router.post("/", requireAuth, create);

module.exports = router;
