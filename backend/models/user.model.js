const pool = require("../config/db");

async function findByEmail(email) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  return rows[0];
}

async function createUser(fullName, email, passwordHash) {
  const [result] = await pool.query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES (?, ?, ?)`,
    [fullName, email, passwordHash]
  );

  return result.insertId;
}

module.exports = {
  findByEmail,
  createUser,
};
