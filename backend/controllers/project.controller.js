const {
  getUserProjects,
  createProject,
} = require("../services/project.service");

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

module.exports = {
  getProjectsPage,
  create,
};
