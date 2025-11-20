// utils/validation.ts
// Validation schemas using Zod

import { z } from 'zod';

// User registration schema
export const registerSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+254[17]\d{8}$/).optional(),
});

// Vehicle creation schema
export const createVehicleSchema = z.object({
  saccoId: z.string(),
  registrationPlate: z.string().regex(/^K[A-Z]{2}\s?\d{3}[A-Z]$/),
  driverId: z.string().optional(),
  conductorId: z.string().optional(),
  route: z.string().min(3),
  capacity: z.number().int().min(1).max(100).default(14),
  photoUrl: z.string().url().optional(),
});

// Vehicle search/filter schema
export const vehicleFilterSchema = z.object({
  route: z.string().optional(),
  sacco: z.string().optional(),
  plate: z.string().optional(),
  minRating: z.string().optional(),
  limit: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (typeof val === 'number') return val;
    const parsed = parseInt(val || '20', 10);
    return isNaN(parsed) ? 20 : parsed;
  }),
  offset: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (typeof val === 'number') return val;
    const parsed = parseInt(val || '0', 10);
    return isNaN(parsed) ? 0 : parsed;
  }),
});

