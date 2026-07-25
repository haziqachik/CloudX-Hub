const pool = require("../config/db");

// Render the authenticated dashboard page.
async function getDashboardPage(req, res) {
  try {
    const user = req.session.user;

    // Total projects
    const [projectRows] = await pool.query(
      `SELECT COUNT(*) AS totalProjects
       FROM projects
       WHERE owner_id = ?`,
      [user.id],
    );

    // Total uploaded files
    const [fileRows] = await pool.query(
      `SELECT COUNT(*) AS totalFiles
       FROM project_files pf
       INNER JOIN projects p
         ON pf.project_id = p.id
       WHERE p.owner_id = ?`,
      [user.id],
    );

    // Recent projects
    const [recentProjects] = await pool.query(
      `SELECT project_name, created_at
       FROM projects
       WHERE owner_id = ?
       ORDER BY created_at DESC
       LIMIT 5`,
      [user.id],
    );

    return res.render("dashboard", {
      user,
      totalProjects: projectRows[0].totalProjects,
      totalFiles: fileRows[0].totalFiles,
      recentProjects,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Unable to load dashboard.");
  }
}

module.exports = {
  getDashboardPage,
};
