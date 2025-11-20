// app/api/vehicles/[id]/route.ts
// Backend: Single vehicle API endpoint

import { NextRequest, NextResponse } from 'next/server';
import { getVehicleById } from '@/services/vehicle.service';
import { createErrorResponse, createSuccessResponse } from '@/utils/errors';

// GET /api/vehicles/:id - Get single vehicle details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vehicle = await getVehicleById(params.id);

    if (!vehicle) {
      return NextResponse.json(
        createErrorResponse(
          'NOT_FOUND',
          'Vehicle not found',
          404
        ),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createSuccessResponse(vehicle)
    );

  } catch (error) {
    console.error('Fetch vehicle error:', error);
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

