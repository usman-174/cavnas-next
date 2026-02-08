// GET /api/admin/tiers
// List all tier capacities with user counts - requires admin role

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TierType, TierCapacityInfo } from '@/types';

// Helper function to verify admin role from Authorization header
async function verifyAdmin(request: NextRequest): Promise<boolean> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return false;
    }

    const userId = authHeader.substring(7);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return user?.role === 'ADMIN';
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all tier capacities
    const tierCapacities = await prisma.tierCapacity.findMany({
      orderBy: [{ tier: 'asc' }],
    });

    // Get actual user counts per tier for verification
    const [earlyBirdUserCount, regularUserCount] = await Promise.all([
      prisma.user.count({ where: { tier: TierType.EARLY_BIRD } }),
      prisma.user.count({ where: { tier: TierType.REGULAR } }),
    ]);

    // Create a map for actual user counts
    const userCounts: Record<string, number> = {
      EARLY_BIRD: earlyBirdUserCount,
      REGULAR: regularUserCount,
    };

    // If no capacities exist, return empty array
    if (tierCapacities.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Format response with calculated values
    const data: (TierCapacityInfo & { actualUserCount: number })[] = tierCapacities.map((tc) => ({
      tier: tc.tier as TierType,
      capacity: tc.capacity,
      currentCount: tc.currentCount,
      actualUserCount: userCounts[tc.tier] || 0,
      remaining: tc.capacity - tc.currentCount,
      progressPercent: Math.round((tc.currentCount / tc.capacity) * 100),
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Admin tiers list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tier capacities' },
      { status: 500 }
    );
  }
}
