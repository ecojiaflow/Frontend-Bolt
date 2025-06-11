import { PrismaClient } from '@prisma/client';

// Prevent multiple instances during development
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a singleton instance
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Save reference in development to prevent hot reload issues
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;