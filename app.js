const express = require('express');
const pool = require('./db');
const {createUsersTable} = require('./src/models/userModel');
const routes = require('./src/routes/server.route');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api/v1', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);

  try {
    // Test DB connection on server start
    await createUsersTable();
    console.log('✅ User table created or already exists');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully at:', result.rows[0].now);
    
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }




});
