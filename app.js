const express = require('express');
const pool = require('./db');
const { createUsersTable } = require('./src/models/userModel');
const { createRequestsTable } = require('./src/models/requestModel');
const routes = require('./src/routes/server.route');
require('dotenv').config();
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// API routes
app.use('/api/v1', routes);

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(` Server running at http://localhost:${PORT}`);

  try {
    await createUsersTable();
    await createRequestsTable();
    const result = await pool.query('SELECT NOW()');
    console.log(' Database connected successfully at:', result.rows[0].now);
    
  } catch (err) {
    console.error(' Database connection failed:', err.message);
  }
});
