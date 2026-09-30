import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export const connectDatabase = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully via Prisma');
    return true;
  } catch (error) {
    logger.warn('PostgreSQL database connection unavailable or offline. Operating in resilient standalone mode with master data store.');
    return false;
  }
};
