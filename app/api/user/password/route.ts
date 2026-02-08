// PATCH /api/user/password
// Update user password

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthCookie } from '@/lib/cookies';
import { validatePassword } from '@/lib/validation/auth';
import bcrypt from 'bcryptjs';
import { AUTH_ERROR_CODES, type AuthErrorCode } from '@/lib/validation/auth';

function errorResponse(error: string, code: AuthErrorCode, status: number = 400) {
  return NextResponse.json({ success: false, error, code }, { status });
}

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
    const { currentPassword, newPassword } = body;

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return errorResponse(passwordValidation.error!, passwordValidation.code!);
    }

    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: cookie.userId },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isValidPassword) {
      return errorResponse(
        'Current password is incorrect',
        AUTH_ERROR_CODES.CREDENTIALS_INVALID,
        401
      );
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update password. Please try again.' },
      { status: 500 }
    );
  }
}
