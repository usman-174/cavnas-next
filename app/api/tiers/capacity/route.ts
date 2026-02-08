// GET /api/tiers/capacity
// Returns current capacity for all tiers - used for landing page visualization

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TierType, TierCapacityInfo } from '@/types';

export async function GET() {
  try {
    // Get all tier capacities
    const tierCapacities = await prisma.tierCapacity.findMany({
      orderBy: [{ tier: 'asc' }],
    });

    // If no capacities exist, return empty array
    if (tierCapacities.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Format response with calculated values
    const data: TierCapacityInfo[] = tierCapacities.map((tc) => ({
      tier: tc.tier as TierType,
      capacity: tc.capacity,
      currentCount: tc.currentCount,
      remaining: tc.capacity - tc.currentCount,
      progressPercent: Math.round((tc.currentCount / tc.capacity) * 100),
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Tier capacity error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tier capacity' },
      { status: 500 }
    );
  }
}
