const express = require("express");
const router = express.Router();

const {
  getProjectsPage,
  create,
  uploadProjectFile,
} = require("../controllers/project.controller");

const { requireAuth } = require("../middleware/auth.middleware");
const upload = require("../config/upload");

// Display all projects belonging to the logged-in user.
router.get("/", requireAuth, getProjectsPage);

// Create a new project.
router.post("/", requireAuth, create);

// Upload a file to a project.
router.post(
  "/:id/upload",
  requireAuth,
  upload.single("file"),
  uploadProjectFile,
);

module.exports = router;
