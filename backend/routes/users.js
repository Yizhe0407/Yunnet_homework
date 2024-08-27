const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

const router = express.Router();

const key = process.env.JWT_SECRET;

// Set up MySQL connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'user_auth',
});

// 1. 註冊
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.send({ error: 'User already exists' });
    }

    // Encrypt the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Store the user in the database
    await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashPassword]);

    // Respond to the client
    res.status(201).send({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: '伺服器錯誤' });
  }
});

// 2. 登入
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) {
      return res.send({ error: 'User not found' });
    }

    // Validate the password
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ error: 'Login error' });
    }

    // Create a JWT token
    const token = jwt.sign({ email, username: user.username }, key); // key 原則上會存在環境變數

    // Respond to the client
    res.send({ message: 'success', token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Server error' });
  }
});

// 3. 驗證用戶（同時取得用戶資料）
router.get('/profile', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send({ error: '未登入' });
  }

  jwt.verify(token, key, async (err, decoded) => {
    if (err) {
      return res.status(403).send({ error: '驗證錯誤' });
    }

    try {
      const [rows] = await db.query('SELECT email, username FROM users WHERE email = ?', [decoded.email]);
      const user = rows[0];

      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }

      res.send({ message: 'success', user });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: '伺服Server error器錯誤' });
    }
  });
});

module.exports = router;