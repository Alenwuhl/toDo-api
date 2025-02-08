import dotenv from 'dotenv';
import express, { json } from 'express';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { authenticateToken } from './middlewares/authMiddleware.js';
import limiter from './middlewares/rateLimiter.js';
import logger from './middlewares/logger.js';


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// middleware to log
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});
// general errors
app.use((err, req, res, next) => {
  logger.error(`Error en ${req.method} ${req.url} - ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

// add the limiter to all routes
app.use(limiter);

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', authenticateToken, taskRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

