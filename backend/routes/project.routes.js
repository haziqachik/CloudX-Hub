const express = require("express");
const router = express.Router();

const {
  getProjectsPage,
  create,
  uploadProjectFile,
  downloadProjectFile,
  deleteProjectFile,
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

// Download a file from a project.
router.get("/files/:fileId/download", requireAuth, downloadProjectFile);

// Delete a file from a project.
router.post("/files/:fileId/delete", requireAuth, deleteProjectFile);

module.exports = router;
