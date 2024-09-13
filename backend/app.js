import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', profileRoutes);

app.listen(process.env.API_PORT, () => {
  console.log(`Server is running on port ${process.env["API_PORT"]}`);
});
