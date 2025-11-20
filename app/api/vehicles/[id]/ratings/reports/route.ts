// app/api/vehicles/[id]/reports/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadToS3 } from '@/lib/s3';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

const reportSchema = z.object({
  tripId: z.string().optional(),
  category: z.enum([
    'RECKLESS_DRIVING',
    'SPEEDING',
    'HARASSMENT',
    'OVERLOADING',
    'UNROADWORTHY',
    'ROUTE_DEVIATION',
    'FARE_DISPUTE',
    'DRUNK_DRIVING',
    'OTHER'
  ]),
  description: z.string().min(10).max(1000),
  isAnonymous: z.boolean().default(false),
});

// Rate limiting: 5 reports per hour per user
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get session
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    // Rate limiting
    try {
      await limiter.check(5, session.user.id);
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'RATE_LIMIT_EXCEEDED', 
            message: 'Too many reports. Please try again later.',
            retryAfter: 3600
          } 
        },
        { status: 429 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const tripId = formData.get('tripId') as string | null;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const isAnonymous = formData.get('isAnonymous') === 'true';
    const photo = formData.get('photo') as File | null;

    // Validate
    const validatedData = reportSchema.parse({
      tripId: tripId || undefined,
      category,
      description,
      isAnonymous,
    });

    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
      include: { sacco: true }
    });

    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Vehicle not found' } },
        { status: 404 }
      );
    }

    // Upload photo if provided
    let photoUrl: string | null = null;
    if (photo && photo.size > 0) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(photo.type)) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'INVALID_FILE_TYPE', 
              message: 'Only JPEG, PNG, and WebP images are allowed' 
            } 
          },
          { status: 400 }
        );
      }

      if (photo.size > maxSize) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'FILE_TOO_LARGE', 
              message: 'Image must be less than 5MB' 
            } 
          },
          { status: 400 }
        );
      }

      // Upload to S3 (or local storage)
      photoUrl = await uploadToS3(photo, 'reports');
    }

    // Check for spam - prevent duplicate reports within 1 hour
    const recentReport = await prisma.report.findFirst({
      where: {
        userId: session.user.id,
        vehicleId: params.id,
        category: validatedData.category,
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000)
        }
      }
    });

    if (recentReport) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'DUPLICATE_REPORT', 
            message: 'You have already submitted a similar report recently' 
          } 
        },
        { status: 400 }
      );
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        userId: isAnonymous ? null : session.user.id,
        vehicleId: params.id,
        tripId: validatedData.tripId,
        category: validatedData.category,
        description: validatedData.description,
        photoUrl,
        isAnonymous,
      },
      include: {
        vehicle: {
          select: {
            id: true,
            registrationPlate: true,
          }
        }
      }
    });

    // Get updated report count
    const reportCount = await prisma.report.count({
      where: {
        vehicleId: params.id,
        status: 'PENDING'
      }
    });

    // TODO: Send real-time notification via SSE
    // TODO: Send email to admin
    // TODO: Send notification to sacco

    return NextResponse.json(
      {
        success: true,
        data: {
          report: {
            id: report.id,
            vehicleId: report.vehicleId,
            category: report.category,
            description: report.description,
            photoUrl: report.photoUrl,
            status: report.status,
            createdAt: report.createdAt,
          },
          vehicle: {
            id: report.vehicle.id,
            registrationPlate: report.vehicle.registrationPlate,
            reportCount,
          }
        },
        message: 'Report submitted successfully. Our team will review it shortly.'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Report submission error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid input data',
            details: error.errors.map(e => ({
              field: e.path.join('.'),
              message: e.message
            }))
          } 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

// GET /api/vehicles/:id/reports - Admin only
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = { vehicleId: params.id };
    if (status) {
      where.status = status;
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          moderator: {
            select: {
              name: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.report.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        reports: reports.map(r => ({
          ...r,
          user: r.isAnonymous ? null : r.user
        })),
        total,
        page: Math.floor(offset / limit) + 1,
        limit,
      }
    });

  } catch (error) {
    console.error('Fetch reports error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}