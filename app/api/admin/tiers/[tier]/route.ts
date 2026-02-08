// PATCH /api/admin/tiers/{tier}
// Update tier capacity - requires admin role

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ tier: string }> }
) {
  try {
    // Verify admin access
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { tier: tierParam } = await params;
    const tier = tierParam.toUpperCase() as TierType;

    // Validate tier type
    if (!Object.values(TierType).includes(tier)) {
      return NextResponse.json(
        { success: false, error: 'Invalid tier type' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { capacity } = body;

    // Validate capacity
    if (typeof capacity !== 'number' || capacity < 0) {
      return NextResponse.json(
        { success: false, error: 'Capacity must be a positive number' },
        { status: 400 }
      );
    }

    // Get current tier capacity and actual user count
    const [existingCapacity, actualUserCount] = await Promise.all([
      prisma.tierCapacity.findUnique({
        where: { tier },
      }),
      prisma.user.count({ where: { tier } }),
    ]);

    if (!existingCapacity) {
      return NextResponse.json(
        { success: false, error: 'Tier capacity not found' },
        { status: 404 }
      );
    }

    // Validate capacity is not below current user count
    if (capacity < actualUserCount) {
      return NextResponse.json(
        {
          success: false,
          error: `Capacity cannot be less than current user count (${actualUserCount})`,
        },
        { status: 400 }
      );
    }

    // Update tier capacity
    const updatedCapacity = await prisma.tierCapacity.update({
      where: { tier },
      data: { capacity },
    });

    // Format response
    const data: TierCapacityInfo = {
      tier: updatedCapacity.tier as TierType,
      capacity: updatedCapacity.capacity,
      currentCount: updatedCapacity.currentCount,
      remaining: updatedCapacity.capacity - updatedCapacity.currentCount,
      progressPercent: Math.round(
        (updatedCapacity.currentCount / updatedCapacity.capacity) * 100
      ),
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Admin tier update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update tier capacity' },
      { status: 500 }
    );
  }
}
