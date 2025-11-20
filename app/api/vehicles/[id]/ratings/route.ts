// app/api/vehicles/[id]/ratings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { calculateVehicleRating } from '@/lib/rating-algorithm';

const ratingSchema = z.object({
  tripId: z.string().optional(),
  score: z.number().min(1).max(5),
  safetyScore: z.number().min(1).max(5),
  cleanlinessScore: z.number().min(1).max(5),
  comfortScore: z.number().min(1).max(5).optional(),
  punctualityScore: z.number().min(1).max(5).optional(),
  comments: z.string().max(500).optional(),
  isAnonymous: z.boolean().default(false),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = ratingSchema.parse(body);

    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    });

    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Vehicle not found' } },
        { status: 404 }
      );
    }

    // Prevent duplicate ratings: one rating per user per vehicle per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingRating = await prisma.rating.findFirst({
      where: {
        userId: session.user.id,
        vehicleId: params.id,
        createdAt: {
          gte: today
        }
      }
    });

    if (existingRating) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'DUPLICATE_RATING', 
            message: 'You have already rated this vehicle today' 
          } 
        },
        { status: 400 }
      );
    }

    // Fraud detection
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    // Check account age for extreme ratings
    const accountAge = Date.now() - user.createdAt.getTime();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    
    if (accountAge < sevenDays && (validatedData.score === 1 || validatedData.score === 5)) {
      // Flag for manual review but still accept
      console.warn(`Suspicious rating from new user: ${user.id} for vehicle ${params.id}`);
    }

    // Check hourly rate limit (10 ratings per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentRatings = await prisma.rating.count({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: oneHourAgo
        }
      }
    });

    if (recentRatings >= 10) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'RATE_LIMIT_EXCEEDED', 
            message: 'Too many ratings submitted. Please try again later.',
            retryAfter: 3600
          } 
        },
        { status: 429 }
      );
    }

    // Create rating in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create rating
      const rating = await tx.rating.create({
        data: {
          userId: session.user.id,
          vehicleId: params.id,
          tripId: validatedData.tripId,
          score: validatedData.score,
          safetyScore: validatedData.safetyScore,
          cleanlinessScore: validatedData.cleanlinessScore,
          comfortScore: validatedData.comfortScore,
          punctualityScore: validatedData.punctualityScore,
          comments: validatedData.comments,
          isAnonymous: validatedData.isAnonymous,
        }
      });

      // Get all ratings for this vehicle
      const allRatings = await tx.rating.findMany({
        where: { vehicleId: params.id },
        select: {
          safetyScore: true,
          cleanlinessScore: true,
          comfortScore: true,
          punctualityScore: true,
        }
      });

      // Calculate new aggregate scores
      const scores = calculateVehicleRating(allRatings);

      // Update vehicle
      const updatedVehicle = await tx.vehicle.update({
        where: { id: params.id },
        data: {
          avgRating: scores.avgRating,
          ratingCount: scores.ratingCount,
          safetyScore: scores.safetyScore,
          cleanlinessScore: scores.cleanlinessScore,
        },
        select: {
          id: true,
          registrationPlate: true,
          avgRating: true,
          ratingCount: true,
          safetyScore: true,
          cleanlinessScore: true,
        }
      });

      return { rating, vehicle: updatedVehicle };
    });

    // TODO: Send real-time update via SSE

    return NextResponse.json(
      {
        success: true,
        data: {
          rating: {
            id: result.rating.id,
            vehicleId: result.rating.vehicleId,
            score: result.rating.score,
            safetyScore: result.rating.safetyScore,
            cleanlinessScore: result.rating.cleanlinessScore,
            createdAt: result.rating.createdAt,
          },
          vehicle: result.vehicle
        },
        message: 'Rating submitted successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Rating submission error:', error);

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

// GET /api/vehicles/:id/ratings
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const [ratings, total, vehicle] = await Promise.all([
      prisma.rating.findMany({
        where: { vehicleId: params.id },
        include: {
          user: {
            select: {
              name: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.rating.count({ where: { vehicleId: params.id } }),
      prisma.vehicle.findUnique({
        where: { id: params.id },
        select: { avgRating: true }
      })
    ]);

    // Calculate rating distribution
    const distribution = ratings.reduce((acc, r) => {
      const score = Math.round(r.score);
      acc[score] = (acc[score] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return NextResponse.json({
      success: true,
      data: {
        ratings: ratings.map(r => ({
          id: r.id,
          score: r.score,
          safetyScore: r.safetyScore,
          cleanlinessScore: r.cleanlinessScore,
          comfortScore: r.comfortScore,
          punctualityScore: r.punctualityScore,
          comments: r.comments,
          isAnonymous: r.isAnonymous,
          createdAt: r.createdAt,
          user: r.isAnonymous ? null : r.user
        })),
        total,
        avgRating: vehicle?.avgRating || 0,
        distribution: {
          '5': distribution[5] || 0,
          '4': distribution[4] || 0,
          '3': distribution[3] || 0,
          '2': distribution[2] || 0,
          '1': distribution[1] || 0,
        },
        page: Math.floor(offset / limit) + 1,
        limit,
      }
    });

  } catch (error) {
    console.error('Fetch ratings error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}