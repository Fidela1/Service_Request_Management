const pool = require('../../db');
const bcrypt = require('bcrypt');

async function createUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(50) NOT NULL,
      lastname VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      telephone VARCHAR(15) UNIQUE NOT NULL,
      role VARCHAR(20) NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `;
}

module.exports = {
  createUsersTable,
};
