// GET /api/admin/users
// List all users with tier, status, reservation - requires admin role

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Get query parameters for filtering/pagination
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get('tier');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (tier) where.tier = tier;
    if (status) where.status = status;

    // Add search filter for email or name
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy clause - validate sortBy to prevent SQL injection
    const validSortFields = ['createdAt', 'name', 'email', 'reservationNumber', 'tier', 'status'];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderBy: any = {};
    orderBy[safeSortBy] = sortOrder === 'asc' ? 'asc' : 'desc';

    // Get users with counts
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
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
        orderBy,
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Get tier counts for summary
    const [earlyBirdCount, regularCount, pendingCount, activeCount] = await Promise.all([
      prisma.user.count({ where: { tier: 'EARLY_BIRD' } }),
      prisma.user.count({ where: { tier: 'REGULAR' } }),
      prisma.user.count({ where: { status: 'PENDING' } }),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users: users.map((u) => ({
          ...u,
          createdAt: u.createdAt.toISOString(),
        })),
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
        },
        summary: {
          total: totalCount,
          earlyBirdCount,
          regularCount,
          pendingCount,
          activeCount,
        },
      },
    });
  } catch (error) {
    console.error('Admin users list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
