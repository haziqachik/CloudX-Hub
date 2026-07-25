const pool = require("../config/db");

// Get all projects belonging to a user.
async function getProjectsByUser(userId) {
  const [projects] = await pool.query(
    `SELECT *
     FROM projects
     WHERE owner_id = ?
     ORDER BY created_at DESC`,
    [userId],
  );

  // Attach uploaded files to each project
  for (const project of projects) {
    const [files] = await pool.query(
      `SELECT *
       FROM project_files
       WHERE project_id = ?
       ORDER BY uploaded_at DESC`,
      [project.id],
    );

    project.files = files;
  }

  return projects;
}

// Create a new project.
async function createProject(ownerId, projectName, description) {
  const [result] = await pool.query(
    `INSERT INTO projects
      (owner_id, project_name, description)
     VALUES (?, ?, ?)`,
    [ownerId, projectName, description],
  );

  return result.insertId;
}

// Get a project by ID.
async function getProjectById(projectId) {
  const [rows] = await pool.query(
    `SELECT *
     FROM projects
     WHERE id = ?`,
    [projectId],
  );

  return rows[0];
}

module.exports = {
  getProjectsByUser,
  createProject,
  getProjectById,
};
