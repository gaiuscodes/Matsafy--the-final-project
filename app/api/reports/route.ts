// app/api/reports/route.ts
// Backend: Reports API endpoint

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { getReports } from '@/services/report.service';
import { createErrorResponse, createSuccessResponse } from '@/utils/errors';

// GET /api/reports - List all reports (with filters)
export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await getServerSession();
    
    // Only authenticated users can view reports
    if (!session?.user) {
      return NextResponse.json(
        createErrorResponse(
          'UNAUTHORIZED',
          'Authentication required',
          401
        ),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    const filters = {
      vehicleId: searchParams.get('vehicleId') || undefined,
      status: searchParams.get('status') || undefined,
      category: searchParams.get('category') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
    };

    const result = await getReports(filters);

    return NextResponse.json(
      createSuccessResponse(result)
    );

  } catch (error) {
    console.error('Fetch reports error:', error);
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

