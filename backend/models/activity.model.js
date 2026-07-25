const pool = require("../config/db");

// Create activity log entry.
async function createActivity(userId, action, ipAddress) {
  const [result] = await pool.query(
    `INSERT INTO activity_logs
      (user_id, action, ip_address)
     VALUES (?, ?, ?)`,
    [userId, action, ipAddress],
  );

  return result.insertId;
}

// Get recent activity logs.
async function getRecentActivities(limit = 20) {
  const [rows] = await pool.query(
    `SELECT
        activity_logs.id,
        activity_logs.action,
        activity_logs.ip_address,
        activity_logs.created_at,
        users.fullName
     FROM activity_logs
     JOIN users
       ON activity_logs.user_id = users.id
     ORDER BY activity_logs.created_at DESC
     LIMIT ?`,
    [limit],
  );

  return rows;
}

module.exports = {
  createActivity,
  getRecentActivities,
};
