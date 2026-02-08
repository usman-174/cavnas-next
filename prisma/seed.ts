// CAB2Wealth Database Seed Script
// Initializes tier capacities and creates default admin user

import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

// Create Prisma client with adapter for v7
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // Create tier capacities
  console.log('📊 Creating tier capacities...');

  const earlyBirdCapacity = await prisma.tierCapacity.upsert({
    where: { tier: 'EARLY_BIRD' },
    update: {},
    create: {
      tier: 'EARLY_BIRD',
      capacity: 1000,
      currentCount: 0,
    },
  });
  console.log(`  ✓ Early Bird: ${earlyBirdCapacity.currentCount}/${earlyBirdCapacity.capacity}`);

  const regularCapacity = await prisma.tierCapacity.upsert({
    where: { tier: 'REGULAR' },
    update: {},
    create: {
      tier: 'REGULAR',
      capacity: 10000,
      currentCount: 0,
    },
  });
  console.log(`  ✓ Regular: ${regularCapacity.currentCount}/${regularCapacity.capacity}`);

  // Create default admin user
  console.log('👤 Creating default admin user...');

  const adminEmail = 'admin@cab2wealth.com';
  const adminPassword = 'CabAdmin@2026';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        name: 'CAB2Wealth Admin',
        tier: 'EARLY_BIRD',
        reservationNumber: 0,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });

    console.log(`  ✓ Admin user created: ${adminEmail}`);
    console.log(`  ✓ Admin password: ${adminPassword}`);
  } else {
    console.log(`  ✓ Admin user already exists: ${adminEmail}`);
  }

  // Create test users for development/testing
  console.log('👥 Creating test users...');

  const testUsers = [
    // Early Bird Tier Users
    { name: 'Alice Johnson', email: 'alice@test.com', tier: 'EARLY_BIRD', status: 'ACTIVE' },
    { name: 'Bob Smith', email: 'bob@test.com', tier: 'EARLY_BIRD', status: 'ACTIVE' },
    { name: 'Carol Williams', email: 'carol@test.com', tier: 'EARLY_BIRD', status: 'PENDING' },
    { name: 'David Brown', email: 'david@test.com', tier: 'EARLY_BIRD', status: 'ACTIVE' },
    { name: 'Eve Davis', email: 'eve@test.com', tier: 'EARLY_BIRD', status: 'SUSPENDED' },
    { name: 'Frank Miller', email: 'frank@test.com', tier: 'EARLY_BIRD', status: 'ACTIVE' },
    { name: 'Grace Wilson', email: 'grace@test.com', tier: 'EARLY_BIRD', status: 'ACTIVE' },
    { name: 'Henry Moore', email: 'henry@test.com', tier: 'EARLY_BIRD', status: 'PENDING' },
    // Regular Tier Users
    { name: 'Ivy Taylor', email: 'ivy@test.com', tier: 'REGULAR', status: 'ACTIVE' },
    { name: 'Jack Anderson', email: 'jack@test.com', tier: 'REGULAR', status: 'ACTIVE' },
    { name: 'Karen Thomas', email: 'karen@test.com', tier: 'REGULAR', status: 'PENDING' },
    { name: 'Leo Jackson', email: 'leo@test.com', tier: 'REGULAR', status: 'ACTIVE' },
    { name: 'Mia White', email: 'mia@test.com', tier: 'REGULAR', status: 'SUSPENDED' },
    { name: 'Noah Harris', email: 'noah@test.com', tier: 'REGULAR', status: 'ACTIVE' },
    { name: 'Olivia Martin', email: 'olivia@test.com', tier: 'REGULAR', status: 'ACTIVE' },
    { name: 'Paul Thompson', email: 'paul@test.com', tier: 'REGULAR', status: 'PENDING' },
  ];

  const defaultPassword = 'TestUser@123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 12);

  let createdCount = 0;
  let skippedCount = 0;

  for (const userData of testUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!existingUser) {
      // Get the next reservation number for this tier
      const maxReservation = await prisma.user.findFirst({
        where: { tier: userData.tier as any },
        orderBy: { reservationNumber: 'desc' },
        select: { reservationNumber: true },
      });

      const nextReservation = (maxReservation?.reservationNumber ?? 0) + 1;

      await prisma.user.create({
        data: {
          email: userData.email,
          passwordHash: hashedPassword,
          name: userData.name,
          tier: userData.tier as any,
          reservationNumber: nextReservation,
          role: 'CLIENT',
          status: userData.status as any,
        },
      });

      createdCount++;
      console.log(`  ✓ Created: ${userData.name} (${userData.tier})`);
    } else {
      skippedCount++;
    }
  }

  console.log(`  ✓ Test users created: ${createdCount}, skipped: ${skippedCount}`);
  console.log(`  ✓ Default test password: ${defaultPassword}`);

  // Update tier capacity counts to match actual user counts
  console.log('📊 Updating tier capacity counts...');

  const earlyBirdUserCount = await prisma.user.count({
    where: { tier: 'EARLY_BIRD' },
  });

  const regularUserCount = await prisma.user.count({
    where: { tier: 'REGULAR' },
  });

  await prisma.tierCapacity.update({
    where: { tier: 'EARLY_BIRD' },
    data: { currentCount: earlyBirdUserCount },
  });

  await prisma.tierCapacity.update({
    where: { tier: 'REGULAR' },
    data: { currentCount: regularUserCount },
  });

  console.log(`  ✓ Early Bird count updated: ${earlyBirdUserCount}`);
  console.log(`  ✓ Regular count updated: ${regularUserCount}`);

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
