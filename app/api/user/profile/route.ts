// PATCH /api/user/profile
// Update user profile (name, email)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthCookie } from '@/lib/cookies';
import { validateEmail, validateName } from '@/lib/validation/auth';

export async function PATCH(request: NextRequest) {
  try {
    // Get user from auth cookie
    const cookie = await getAuthCookie();
    if (!cookie) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email } = body;

    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return NextResponse.json(
        { success: false, error: nameValidation.error, code: nameValidation.code },
        { status: 400 }
      );
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { success: false, error: emailValidation.error, code: emailValidation.code },
        { status: 400 }
      );
    }

    // Check if email is being changed and if it's already taken
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser && existingUser.id !== cookie.userId) {
      return NextResponse.json(
        { success: false, error: 'This email is already in use', code: 'EMAIL_EXISTS' },
        { status: 409 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: cookie.userId },
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
      },
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

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile. Please try again.' },
      { status: 500 }
    );
  }
}
