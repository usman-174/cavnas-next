// GET /api/auth/session
// Get current session - validates user from auth cookie and returns session data

import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookie } from '@/lib/cookies';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get user from auth cookie
    const authCookie = await getAuthCookie();

    if (!authCookie) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: authCookie.userId },
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

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data (without password)
    const userData = {
      ...user,
      createdAt: user.createdAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { success: false, error: 'Session validation failed' },
      { status: 500 }
    );
  }
}
