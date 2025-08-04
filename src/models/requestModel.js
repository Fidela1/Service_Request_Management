const pool = require('../../db');

async function createRequestsTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS requests (
             id SERIAL PRIMARY KEY,
             user_id INTEGER NOT NULL,
             title VARCHAR(255) NOT NULL,
             description TEXT NOT NULL,
             status VARCHAR(50) NOT NULL DEFAULT 'pending',
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

}
module.exports = {
    createRequestsTable,
};