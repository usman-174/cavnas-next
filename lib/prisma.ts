// CAB2Wealth Prisma Client Singleton
// Prisma v7 with PostgreSQL adapter

import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Declare global for Prisma singleton in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof createPrismaClient>;
}

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  return new PrismaClient({ adapter });
}

export const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
