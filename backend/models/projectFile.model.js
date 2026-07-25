const pool = require("../config/db");

// Save uploaded file metadata
async function createFile(projectId, fileName, s3Key) {
  const [result] = await pool.query(
    `INSERT INTO project_files
      (project_id, file_name, s3_key)
     VALUES (?, ?, ?)`,
    [projectId, fileName, s3Key],
  );

  return result.insertId;
}

// Get all files for a project
async function getFilesByProject(projectId) {
  const [rows] = await pool.query(
    `SELECT *
     FROM project_files
     WHERE project_id = ?
     ORDER BY uploaded_at DESC`,
    [projectId],
  );

  return rows;
}

// Get a single file by ID
async function getFileById(fileId) {
  const [rows] = await pool.query(
    `SELECT *
     FROM project_files
     WHERE id = ?`,
    [fileId],
  );

  return rows[0];
}

// Delete a file record
async function deleteFile(fileId) {
  const [result] = await pool.query(
    `DELETE FROM project_files
     WHERE id = ?`,
    [fileId],
  );

  return result.affectedRows;
}

module.exports = {
  createFile,
  getFilesByProject,
  getFileById,
  deleteFile,
};
