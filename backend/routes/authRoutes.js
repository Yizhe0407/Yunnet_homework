// routes/authRoutes.js
import express from 'express';
import { signup, login } from '../controllers/authController.js'; // 確保這個路徑正確

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

export default router;
