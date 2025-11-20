// lib/prisma.ts

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Helper function to handle Prisma errors
export function handlePrismaError(error: any): {
  status: number;
  message: string;
} {
  if (error.code === 'P2002') {
    return {
      status: 409,
      message: `A record with this ${error.meta?.target?.[0] || 'field'} already exists`,
    };
  }

  if (error.code === 'P2025') {
    return {
      status: 404,
      message: 'Record not found',
    };
  }

  if (error.code === 'P2003') {
    return {
      status: 400,
      message: 'Invalid reference to related record',
    };
  }

  return {
    status: 500,
    message: 'Database error occurred',
  };
}