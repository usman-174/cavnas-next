import { getAuthCookie } from './cookies';
import { prisma } from './prisma';
import type { CabUser, TierType, UserRole, UserStatus } from '@/types';

/**
 * Get the current authenticated user from the database using the auth cookie
 * Returns null if not authenticated or user not found
 */
export async function getServerUser(): Promise<CabUser | null> {
  const cookie = await getAuthCookie();
  if (!cookie) return null;

  const user = await prisma.user.findUnique({
    where: { id: cookie.userId },
    select: {
      id: true,
      email: true,
      name: true,
      tier: true,
      reservationNumber: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  // Convert Prisma enums to types and dates to strings
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    tier: user.tier as TierType,
    reservationNumber: user.reservationNumber,
    role: user.role as UserRole,
    status: user.status as UserStatus,
    createdAt: user.createdAt.toISOString(),
  };
}

/**
 * Get the current user only if they are an admin
 * Returns null if not authenticated or not an admin
 */
export async function requireAdmin(): Promise<CabUser | null> {
  const user = await getServerUser();
  if (!user || user.role !== 'ADMIN') {
    return null;
  }
  return user;
}

/**
 * Check if the current user is authenticated
 * Useful for quick auth checks in server components
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookie = await getAuthCookie();
  if (!cookie) return false;

  // Verify user still exists in database
  const user = await prisma.user.findUnique({
    where: { id: cookie.userId },
    select: { id: true },
  });

  return !!user;
}
