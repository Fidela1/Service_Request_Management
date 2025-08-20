const pool = require("../../db");
const bcrypt = require("bcrypt");

async function createUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(50) NOT NULL,
      lastname VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      telephone VARCHAR(15) UNIQUE NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'user',
      password VARCHAR(255) NOT NULL
    );
  `;
  await pool.query(query);

  
  const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
  const adminTel = process.env.ADMIN_PHONE || "0780096887";
  const adminPass = process.env.ADMIN_PASSWORD || "pass@123";
  const hashedPassword = await bcrypt.hash(adminPass, 10);

  await pool.query(
    `INSERT INTO users (firstname, lastname, email, telephone, role, password)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (email) DO NOTHING`,
    ["Fidela", "Tuyizere", adminEmail, adminTel, "admin", hashedPassword]
  );

  console.log("Users table ready. Admin account seeded.");
}

module.exports = { createUsersTable };
