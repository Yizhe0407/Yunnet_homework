import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

const app = express();
const port = 3000;

app.use(cors()); // 啟用 CORS
app.use(express.json()); // Middleware to parse JSON requests

// 使用路由
app.use('/api', authRoutes);
app.use('/api', profileRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
