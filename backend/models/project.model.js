const pool = require("../config/db");

// Get all projects belonging to a user.
async function getProjectsByUser(userId) {
  const [rows] = await pool.query(
    `SELECT *
     FROM projects
     WHERE owner_id = ?
     ORDER BY created_at DESC`,
    [userId],
  );

  return rows;
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

module.exports = {
  getProjectsByUser,
  createProject,
};
