import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';
const key = process.env.JWT_SECRET;

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.send({ error: 'User already exists' });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashPassword]);
    res.status(201).send({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) {
      return res.send({ error: 'User not found' });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ error: 'Login error' });
    }
    const token = jwt.sign({ email, username: user.username }, key);
    res.send({ message: 'success', token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Server error' });
  }
};
