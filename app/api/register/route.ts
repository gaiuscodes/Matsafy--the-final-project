// app/api/register/route.ts
// Backend: User registration API endpoint

import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/services/user.service';
import { handleValidationError, createErrorResponse, createSuccessResponse } from '@/utils/errors';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await createUser(body);

    return NextResponse.json(
      createSuccessResponse(
        { user },
        'Registration successful! Please log in.'
      ),
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        createErrorResponse(
          'VALIDATION_ERROR',
          'Invalid input data',
          400,
          error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        ),
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'USER_EXISTS') {
      return NextResponse.json(
        createErrorResponse(
          'USER_EXISTS',
          'User with this email already exists',
          409
        ),
        { status: 409 }
      );
    }

    return NextResponse.json(
      createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred',
        500
      ),
      { status: 500 }
    );
  }
}