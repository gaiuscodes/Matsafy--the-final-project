// services/user.service.ts
// User business logic

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/utils/validation';
import { z } from 'zod';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface UserResult {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
}

/**
 * Check if a user exists by email
 */
export async function userExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });
  return !!user;
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserData): Promise<UserResult> {
  // Validate input
  const validatedData = registerSchema.parse(data);

  // Check if user already exists
  if (await userExists(validatedData.email)) {
    throw new Error('USER_EXISTS');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(validatedData.password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: validatedData.email,
      passwordHash,
      name: validatedData.name,
      phone: validatedData.phone,
      role: 'USER',
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    }
  });

  return user;
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });
}

/**
 * Update user's last login timestamp
 */
export async function updateLastLogin(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() }
  });
}

/**
 * Verify user password
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

