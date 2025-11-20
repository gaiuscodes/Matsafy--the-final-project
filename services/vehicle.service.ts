// services/vehicle.service.ts
// Vehicle business logic

import { prisma } from '@/lib/prisma';
import { createVehicleSchema, vehicleFilterSchema } from '@/utils/validation';
import { z } from 'zod';

export interface VehicleFilters {
  route?: string;
  sacco?: string;
  plate?: string;
  minRating?: string;
  limit?: number;
  offset?: number;
}

export interface CreateVehicleData {
  saccoId: string;
  registrationPlate: string;
  driverId?: string;
  conductorId?: string;
  route: string;
  capacity?: number;
  photoUrl?: string;
}

export interface VehicleListItem {
  id: string;
  registrationPlate: string;
  route: string;
  capacity: number;
  avgRating: number;
  ratingCount: number;
  safetyScore: number;
  cleanlinessScore: number;
  photoUrl: string | null;
  sacco: {
    id: string;
    name: string;
  };
  driver: {
    id: string;
    name: string;
  } | null;
  reportCount: number;
}

export interface VehicleListResult {
  vehicles: VehicleListItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Get vehicles with filters and pagination
 */
export async function getVehicles(filters: VehicleFilters): Promise<VehicleListResult> {
  // Parse and validate filters
  const validatedFilters = vehicleFilterSchema.parse(filters);
  
  const limit = Math.min(validatedFilters.limit || 20, 100);
  const offset = validatedFilters.offset || 0;

  // Build where clause
  const where: any = {};
  
  if (validatedFilters.route) {
    where.route = { contains: validatedFilters.route, mode: 'insensitive' };
  }
  
  if (validatedFilters.plate) {
    where.registrationPlate = { contains: validatedFilters.plate, mode: 'insensitive' };
  }
  
  if (validatedFilters.sacco) {
    where.sacco = {
      name: { contains: validatedFilters.sacco, mode: 'insensitive' }
    };
  }
  
  if (validatedFilters.minRating) {
    where.avgRating = { gte: parseFloat(validatedFilters.minRating) };
  }

  // Fetch vehicles and count
  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      include: {
        sacco: {
          select: {
            id: true,
            name: true,
          }
        },
        driver: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: {
            reports: {
              where: { status: 'PENDING' }
            }
          }
        }
      },
      orderBy: [
        { avgRating: 'desc' },
        { ratingCount: 'desc' }
      ],
      take: limit,
      skip: offset,
    }),
    prisma.vehicle.count({ where })
  ]);

  return {
    vehicles: vehicles.map(v => ({
      id: v.id,
      registrationPlate: v.registrationPlate,
      route: v.route,
      capacity: v.capacity,
      avgRating: v.avgRating,
      ratingCount: v.ratingCount,
      safetyScore: v.safetyScore,
      cleanlinessScore: v.cleanlinessScore,
      photoUrl: v.photoUrl,
      sacco: v.sacco,
      driver: v.driver,
      reportCount: v._count.reports,
    })),
    total,
    page: Math.floor(offset / limit) + 1,
    limit,
    hasMore: offset + limit < total,
  };
}

/**
 * Check if vehicle exists by registration plate
 */
export async function vehicleExists(registrationPlate: string): Promise<boolean> {
  const vehicle = await prisma.vehicle.findUnique({
    where: { registrationPlate }
  });
  return !!vehicle;
}

/**
 * Create a new vehicle
 */
export async function createVehicle(data: CreateVehicleData) {
  // Validate input
  const validatedData = createVehicleSchema.parse(data);

  // Check if vehicle already exists
  if (await vehicleExists(validatedData.registrationPlate)) {
    throw new Error('VEHICLE_EXISTS');
  }

  // Create vehicle
  const vehicle = await prisma.vehicle.create({
    data: validatedData,
    include: {
      sacco: true,
      driver: true,
      conductor: true,
    }
  });

  return vehicle;
}

/**
 * Get vehicle by ID
 */
export async function getVehicleById(id: string) {
  return prisma.vehicle.findUnique({
    where: { id },
    include: {
      sacco: true,
      driver: true,
      conductor: true,
      ratings: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      },
      _count: {
        select: {
          ratings: true,
          reports: true,
        }
      }
    }
  });
}

