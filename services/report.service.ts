// services/report.service.ts
// Report business logic

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export interface CreateReportData {
  vehicleId: string;
  tripId?: string;
  category: string;
  description: string;
  photoUrl?: string;
  isAnonymous?: boolean;
  userId?: string;
}

export interface ReportFilters {
  vehicleId?: string;
  status?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface ReportListItem {
  id: string;
  vehicleId: string;
  category: string;
  description: string;
  photoUrl: string | null;
  status: string;
  isAnonymous: boolean;
  createdAt: Date;
  vehicle: {
    id: string;
    registrationPlate: string;
    route: string;
    sacco: {
      name: string;
    };
  };
  user: {
    id: string;
    name: string;
  } | null;
}

export interface ReportListResult {
  reports: ReportListItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Get reports with filters and pagination
 */
export async function getReports(filters: ReportFilters): Promise<ReportListResult> {
  const limit = Math.min(filters.limit || 20, 100);
  const offset = filters.offset || 0;

  const where: any = {};
  
  if (filters.vehicleId) {
    where.vehicleId = filters.vehicleId;
  }
  
  if (filters.status) {
    where.status = filters.status;
  }
  
  if (filters.category) {
    where.category = filters.category;
  }

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: {
        vehicle: {
          include: {
            sacco: {
              select: {
                name: true,
              }
            }
          }
        },
        user: {
          select: {
            id: true,
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

  return {
    reports: reports.map(r => ({
      id: r.id,
      vehicleId: r.vehicleId,
      category: r.category,
      description: r.description,
      photoUrl: r.photoUrl,
      status: r.status,
      isAnonymous: r.isAnonymous,
      createdAt: r.createdAt,
      vehicle: {
        id: r.vehicle.id,
        registrationPlate: r.vehicle.registrationPlate,
        route: r.vehicle.route,
        sacco: {
          name: r.vehicle.sacco.name,
        }
      },
      user: r.isAnonymous ? null : r.user,
    })),
    total,
    page: Math.floor(offset / limit) + 1,
    limit,
    hasMore: offset + limit < total,
  };
}

/**
 * Create a new report
 */
export async function createReport(data: CreateReportData) {
  const report = await prisma.report.create({
    data: {
      userId: data.isAnonymous ? null : data.userId,
      vehicleId: data.vehicleId,
      tripId: data.tripId,
      category: data.category,
      description: data.description,
      photoUrl: data.photoUrl,
      isAnonymous: data.isAnonymous || false,
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

  return report;
}

/**
 * Check for duplicate reports (spam prevention)
 */
export async function checkDuplicateReport(
  userId: string,
  vehicleId: string,
  category: string,
  timeWindow: number = 60 * 60 * 1000 // 1 hour
): Promise<boolean> {
  const recentReport = await prisma.report.findFirst({
    where: {
      userId,
      vehicleId,
      category,
      createdAt: {
        gte: new Date(Date.now() - timeWindow)
      }
    }
  });

  return !!recentReport;
}

/**
 * Get report by ID
 */
export async function getReportById(id: string) {
  return prisma.report.findUnique({
    where: { id },
    include: {
      vehicle: {
        include: {
          sacco: true,
        }
      },
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
    }
  });
}

