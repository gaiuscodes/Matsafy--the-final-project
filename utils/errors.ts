// utils/errors.ts
// Error handling utilities

import { z } from 'zod';
import { handlePrismaError } from '@/lib/prisma';

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
}

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Handle validation errors
export function handleValidationError(error: z.ZodError): ApiError {
  return {
    code: 'VALIDATION_ERROR',
    message: 'Invalid input data',
    details: error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }))
  };
}

// Handle Prisma errors
export function handleDatabaseError(error: any): { status: number; error: ApiError } {
  const prismaError = handlePrismaError(error);
  return {
    status: prismaError.status,
    error: {
      code: 'DATABASE_ERROR',
      message: prismaError.message
    }
  };
}

// Create standardized API error response
export function createErrorResponse(
  code: string,
  message: string,
  status: number = 500,
  details?: Array<{ field: string; message: string }>
) {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details && { details })
    }
  };
}

// Create standardized success response
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
) {
  return {
    success: true,
    data,
    ...(message && { message })
  };
}

