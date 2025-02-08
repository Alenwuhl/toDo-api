import dotenv from 'dotenv';
import express, { json } from 'express';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { authenticateToken } from './middlewares/authMiddleware.js';


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', authenticateToken, taskRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

