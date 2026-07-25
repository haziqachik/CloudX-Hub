const {
  getUserProjects,
  createProject,
} = require("../services/project.service");

const projectModel = require("../models/project.model");
const { uploadFile } = require("../services/s3.service");

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

    const result = await uploadFile(req.file, projectId);

    return res.json({
      message: "File uploaded successfully!",
      file: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Upload failed.");
  }
}

module.exports = {
  getProjectsPage,
  create,
  uploadProjectFile,
};
