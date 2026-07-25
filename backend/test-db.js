const pool = require("./config/db");

async function testConnection() {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.query("SELECT NOW() AS current_time");

    console.log("✅ Connected successfully!");
    console.log(rows);

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection failed");
    console.error("Code:", err.code);
    console.error("Message:", err.message);
    console.error(err);

    process.exit(1);
  }
}

testConnection();
