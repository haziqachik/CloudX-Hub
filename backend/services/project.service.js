const projectModel = require("../models/project.model");

// Get all projects for the logged-in user.
async function getUserProjects(userId) {
  return await projectModel.getProjectsByUser(userId);
}

// Create a new project.
async function createProject({ ownerId, projectName, description }) {
  const name = String(projectName || "").trim();
  const desc = String(description || "").trim();

  if (!name) {
    return {
      success: false,
      error: "Project name is required.",
    };
  }

  const projectId = await projectModel.createProject(ownerId, name, desc);

  return {
    success: true,
    project: {
      id: projectId,
      ownerId,
      projectName: name,
      description: desc,
    },
  };
}

module.exports = {
  getUserProjects,
  createProject,
};
