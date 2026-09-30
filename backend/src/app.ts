import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import apiRoutes from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// CORS Configuration
const allowedOrigins = [
  env.CORS_ORIGIN,
  env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Cross-Origin Request Blocked by IndoStates Hospital CORS Policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(env.UPLOAD_DIR));

// Mount REST API version 1
app.use('/api/v1', apiRoutes);

// Root greeting / info
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'IndoStates Hospital Backend API Service is active.',
    documentation: '/api/v1/health',
    version: '1.0.0',
  });
});

// 404 Catch-All Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.method} ${req.url}' does not exist on this server.`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
