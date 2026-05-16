import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
// @ts-ignore
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import logger from './config/logger';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';

const app = express();

// Security & Logging
app.use(helmet());
app.use(xss());

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again after 15 minutes',
// });
// app.use('/api/', limiter);

app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: true, message: 'Server is running' });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
