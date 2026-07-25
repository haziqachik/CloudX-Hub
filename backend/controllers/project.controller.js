const {
  getUserProjects,
  createProject,
} = require("../services/project.service");

const projectModel = require("../models/project.model");
const projectFileModel = require("../models/projectFile.model");

const { uploadFile, downloadFile } = require("../services/s3.service");

// Display the logged-in user's projects.
async function getProjectsPage(req, res) {
  const user = req.session.user;

  const projects = await getUserProjects(user.id);

  return res.render("projects", {
    user,
    projects,
    errors: [],
  });
}

// Handle creation of a new project.
async function create(req, res) {
  const user = req.session.user;

  const { projectName, description } = req.body;

  const result = await createProject({
    ownerId: user.id,
    projectName,
    description,
  });

  if (!result.success) {
    const projects = await getUserProjects(user.id);

    return res.status(400).render("projects", {
      user,
      projects,
      errors: [result.error],
    });
  }

  return res.redirect("/projects");
}

// Handle file upload for a project.
async function uploadProjectFile(req, res) {
  try {
    const projectId = req.params.id;
    const userId = req.session.user.id;

    const project = await projectModel.getProjectById(projectId);

    if (!project) {
      return res.status(404).send("Project not found");
    }

    if (project.owner_id !== userId) {
      return res.status(403).send("Access denied");
    }

    if (!req.file) {
      return res.status(400).send("Please select a file.");
    }

    // Upload to S3
    const result = await uploadFile(req.file, projectId);

    // Save metadata
    await projectFileModel.createFile(
      projectId,
      req.file.originalname,
      result.key,
    );

    return res.redirect("/projects");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Upload failed.");
  }
}

// Download a file
async function downloadProjectFile(req, res) {
  try {
    const fileId = req.params.fileId;
    const userId = req.session.user.id;

    const file = await projectFileModel.getFileById(fileId);

    if (!file) {
      return res.status(404).send("File not found");
    }

    const project = await projectModel.getProjectById(file.project_id);

    if (!project) {
      return res.status(404).send("Project not found");
    }

    if (project.owner_id !== userId) {
      return res.status(403).send("Access denied");
    }

    const result = await downloadFile(file.s3_key);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.file_name}"`,
    );

    if (result.ContentType) {
      res.setHeader("Content-Type", result.ContentType);
    }

    result.Body.pipe(res);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Download failed.");
  }
}

module.exports = {
  getProjectsPage,
  create,
  uploadProjectFile,
  downloadProjectFile,
};
