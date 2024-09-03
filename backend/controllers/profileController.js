import jwt from 'jsonwebtoken';
import db from '../config/db.js';
const key = process.env.JWT_SECRET;

export const getProfile = (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send({ error: 'Not logged in' });
  }
  jwt.verify(token, key, async (err, decoded) => {
    if (err) {
      return res.status(403).send({ error: 'Verification error' });
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
      res.status(500).send({ error: 'Server error' });
    }
  });
};
