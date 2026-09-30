import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/db';
import { logger } from './utils/logger';

const startServer = async () => {
  // Connect to Database
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(`=======================================================`);
    logger.info(`INDOSTATES HOSPITAL BACKEND API RUNNING ON PORT ${env.PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
    logger.info(`API Base URL: http://localhost:${env.PORT}/api/v1`);
    logger.info(`Health Check: http://localhost:${env.PORT}/api/v1/health`);
    logger.info(`=======================================================`);
  });

  // Graceful shutdown handling
  const gracefulShutdown = (signal: string) => {
    logger.info(`${signal} received: closing HTTP server safely.`);
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
