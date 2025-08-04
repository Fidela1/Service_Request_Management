const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const createUsers = async (req, res) => {
    const { firstname, lastname, email, telephone, role = 'user', password } = req.body;

    try {
         if (!firstname || !lastname || !email || !telephone || !password) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
          `INSERT INTO users (firstname, lastname, email, telephone, role, password)
           VALUES ($1, $2, $3, $4, $5, $6) 
           RETURNING id, firstname, lastname, email, telephone, role`,
           [firstname, lastname, email, telephone, role, hashedPassword]
        );
        
        res.status(201).json({
            message: 'User created successfully',
            user: result.rows[0],
        })
    }
    catch(error){
        if (error.code === '23505') {
      res.status(409).json({ error: 'Email or telephone already exists' });
    } else {
      console.error('❌ Error creating user:', error.message);
      res.status(500).json({ error: 'Server error' });
    }
    }
    
}
 const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'mysecret',
      { expiresIn: process.env.JWT_EXPIRES_IN}
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
    createUsers,
    loginUser
};