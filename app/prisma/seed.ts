// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@easymat.com',
        passwordHash: await bcrypt.hash('admin123', 10),
        name: 'Admin User',
        phone: '+254712345678',
        role: 'ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'john@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        name: 'John Kamau',
        phone: '+254723456789',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        name: 'Jane Wanjiku',
        phone: '+254734567890',
        role: 'USER',
        isAnonymousPref: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'peter@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        name: 'Peter Omondi',
        phone: '+254745678901',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'mary@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        name: 'Mary Achieng',
        phone: '+254756789012',
        role: 'USER',
      },
    }),
  ]);

  // Create Saccos
  const saccos = await Promise.all([
    prisma.sacco.create({
      data: {
        name: 'Nairobi Matatu Sacco',
        contact: '+254700111222',
        email: 'info@nairobisacco.co.ke',
        address: 'Tom Mboya Street, Nairobi',
      },
    }),
    prisma.sacco.create({
      data: {
        name: 'City Hoppa',
        contact: '+254700333444',
        email: 'support@cityhoppa.co.ke',
        address: 'River Road, Nairobi',
      },
    }),
    prisma.sacco.create({
      data: {
        name: 'Super Metro',
        contact: '+254700555666',
        email: 'info@supermetro.co.ke',
        address: 'Accra Road, Nairobi',
      },
    }),
  ]);

  // Create Drivers
  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        name: 'David Mwangi',
        phone: '+254767890123',
        licenseNo: 'DL-001-2020',
      },
    }),
    prisma.driver.create({
      data: {
        name: 'Samuel Kiprotich',
        phone: '+254778901234',
        licenseNo: 'DL-002-2019',
      },
    }),
    prisma.driver.create({
      data: {
        name: 'James Otieno',
        phone: '+254789012345',
        licenseNo: 'DL-003-2021',
      },
    }),
    prisma.driver.create({
      data: {
        name: 'Robert Kariuki',
        phone: '+254790123456',
        licenseNo: 'DL-004-2020',
      },
    }),
    prisma.driver.create({
      data: {
        name: 'Patrick Muturi',
        phone: '+254701234567',
        licenseNo: 'DL-005-2022',
      },
    }),
  ]);

  // Create Conductors
  const conductors = await Promise.all([
    prisma.conductor.create({
      data: {
        name: 'Michael Odhiambo',
        phone: '+254712345670',
      },
    }),
    prisma.conductor.create({
      data: {
        name: 'Francis Wekesa',
        phone: '+254723456781',
      },
    }),
    prisma.conductor.create({
      data: {
        name: 'Joseph Njoroge',
        phone: '+254734567892',
      },
    }),
    prisma.conductor.create({
      data: {
        name: 'Daniel Kipchoge',
        phone: '+254745678903',
      },
    }),
    prisma.conductor.create({
      data: {
        name: 'George Mutua',
        phone: '+254756789014',
      },
    }),
  ]);

  // Create Vehicles
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        saccoId: saccos[0].id,
        registrationPlate: 'KCA 123A',
        driverId: drivers[0].id,
        conductorId: conductors[0].id,
        route: 'CBD - Ngong Road',
        capacity: 14,
        avgRating: 4.2,
        ratingCount: 45,
        safetyScore: 4.5,
        cleanlinessScore: 4.0,
      },
    }),
    prisma.vehicle.create({
      data: {
        saccoId: saccos[0].id,
        registrationPlate: 'KCB 456B',
        driverId: drivers[1].id,
        conductorId: conductors[1].id,
        route: 'CBD - Thika Road',
        capacity: 14,
        avgRating: 3.8,
        ratingCount: 32,
        safetyScore: 3.5,
        cleanlinessScore: 4.0,
      },
    }),
    prisma.vehicle.create({
      data: {
        saccoId: saccos[1].id,
        registrationPlate: 'KCC 789C',
        driverId: drivers[2].id,
        conductorId: conductors[2].id,
        route: 'CBD - Eastleigh',
        capacity: 14,
        avgRating: 4.5,
        ratingCount: 67,
        safetyScore: 4.7,
        cleanlinessScore: 4.3,
      },
    }),
    prisma.vehicle.create({
      data: {
        saccoId: saccos[1].id,
        registrationPlate: 'KCD 012D',
        driverId: drivers[3].id,
        conductorId: conductors[3].id,
        route: 'CBD - Westlands',
        capacity: 14,
        avgRating: 2.9,
        ratingCount: 28,
        safetyScore: 2.5,
        cleanlinessScore: 3.2,
      },
    }),
    prisma.vehicle.create({
      data: {
        saccoId: saccos[2].id,
        registrationPlate: 'KCE 345E',
        driverId: drivers[4].id,
        conductorId: conductors[4].id,
        route: 'CBD - Kilimani',
        capacity: 14,
        avgRating: 4.0,
        ratingCount: 53,
        safetyScore: 4.1,
        cleanlinessScore: 3.9,
      },
    }),
  ]);

  // Create sample trips
  const trips = await Promise.all([
    prisma.trip.create({
      data: {
        userId: users[1].id,
        vehicleId: vehicles[0].id,
        seatNo: '5',
        destination: 'Karen',
        startedAt: new Date('2025-11-01T08:30:00Z'),
        endedAt: new Date('2025-11-01T09:15:00Z'),
      },
    }),
    prisma.trip.create({
      data: {
        userId: users[2].id,
        vehicleId: vehicles[1].id,
        seatNo: '12',
        destination: 'Ruiru',
        startedAt: new Date('2025-11-02T07:00:00Z'),
        endedAt: new Date('2025-11-02T08:00:00Z'),
      },
    }),
    prisma.trip.create({
      data: {
        userId: users[3].id,
        vehicleId: vehicles[3].id,
        seatNo: '3',
        destination: 'Westlands',
        startedAt: new Date('2025-11-03T17:30:00Z'),
        endedAt: new Date('2025-11-03T18:15:00Z'),
      },
    }),
  ]);

  // Create sample ratings
  await Promise.all([
    prisma.rating.create({
      data: {
        userId: users[1].id,
        vehicleId: vehicles[0].id,
        tripId: trips[0].id,
        score: 4.5,
        safetyScore: 5.0,
        cleanlinessScore: 4.0,
        comfortScore: 4.5,
        punctualityScore: 4.0,
        comments: 'Very safe driver, clean matatu. Excellent experience!',
      },
    }),
    prisma.rating.create({
      data: {
        userId: users[2].id,
        vehicleId: vehicles[1].id,
        tripId: trips[1].id,
        score: 3.5,
        safetyScore: 3.0,
        cleanlinessScore: 4.0,
        comfortScore: 3.5,
        punctualityScore: 4.0,
        comments: 'Driver was speeding a bit, but overall okay.',
        isAnonymous: true,
      },
    }),
    prisma.rating.create({
      data: {
        userId: users[3].id,
        vehicleId: vehicles[3].id,
        tripId: trips[2].id,
        score: 2.5,
        safetyScore: 2.0,
        cleanlinessScore: 3.0,
        comfortScore: 2.5,
        punctualityScore: 3.0,
        comments: 'Very reckless driving. Nearly caused an accident.',
      },
    }),
  ]);

  // Create sample reports
  await Promise.all([
    prisma.report.create({
      data: {
        userId: users[2].id,
        vehicleId: vehicles[1].id,
        tripId: trips[1].id,
        category: 'SPEEDING',
        description: 'Driver was consistently exceeding speed limits on Thika Road.',
        status: 'PENDING',
        isAnonymous: true,
      },
    }),
    prisma.report.create({
      data: {
        userId: users[3].id,
        vehicleId: vehicles[3].id,
        tripId: trips[2].id,
        category: 'RECKLESS_DRIVING',
        description: 'Driver overtook dangerously near Westgate Mall and ignored traffic lights.',
        status: 'VERIFIED',
        moderatedBy: users[0].id,
        moderatorNotes: 'Verified through multiple reports. Driver warned.',
        moderatedAt: new Date('2025-11-04T10:00:00Z'),
      },
    }),
    prisma.report.create({
      data: {
        userId: users[4].id,
        vehicleId: vehicles[3].id,
        category: 'HARASSMENT',
        description: 'Conductor was rude and used inappropriate language towards female passengers.',
        status: 'PENDING',
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });