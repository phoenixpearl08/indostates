import dotenv from 'dotenv';
import path from 'path';

// Load .env from root or backend directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // fallback

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/indostates_db?schema=public',
  JWT_SECRET: process.env.JWT_SECRET || 'indostates_development_secret_key_98374291837498',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads'),
  UPLOAD_MAX_FILE_SIZE_MB: process.env.UPLOAD_MAX_FILE_SIZE_MB ? parseInt(process.env.UPLOAD_MAX_FILE_SIZE_MB, 10) : 5,
};
