'use server'

import { prisma } from '@/lib/prisma';
import { TierType, TierCapacityInfo } from '@/types';

/**
 * Fallback data when database is empty or unreachable.
 * This ensures the homepage always displays meaningful capacity information.
 */
const FALLBACK_CAPACITIES: TierCapacityInfo[] = [
  {
    tier: TierType.EARLY_BIRD,
    capacity: 1000,
    currentCount: 0,
    remaining: 1000,
    progressPercent: 0,
  },
  {
    tier: TierType.REGULAR,
    capacity: 10000,
    currentCount: 0,
    remaining: 10000,
    progressPercent: 0,
  },
];

/**
 * Fetches tier capacity data from the database with proper validation and fallback.
 * Used by both the homepage (server-side) and the API route (client-side).
 *
 * @returns Array of tier capacity information with calculated values
 */
export async function getTierCapacity(): Promise<TierCapacityInfo[]> {
  try {
    const tierCapacities = await prisma.tierCapacity.findMany({
      orderBy: [{ tier: 'asc' }],
    });

    // If no capacities exist in database, return fallback data
    if (tierCapacities.length === 0) {
      return FALLBACK_CAPACITIES;
    }

    // Transform database records to TierCapacityInfo with validation
    return tierCapacities.map((tc) => {
      const currentCount = Math.max(0, tc.currentCount);
      const capacity = Math.max(1, tc.capacity); // Prevent division by zero
      const remaining = Math.max(0, capacity - currentCount);
      const progressPercent = Math.min(
        100,
        Math.round((currentCount / capacity) * 100)
      );

      return {
        tier: tc.tier as TierType,
        capacity,
        currentCount,
        remaining,
        progressPercent,
      };
    });
  } catch (error) {
    // Log error for debugging but return fallback data to maintain uptime
    console.error('Failed to fetch tier capacity, using fallback:', error);
    return FALLBACK_CAPACITIES;
  }
}
