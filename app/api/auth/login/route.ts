// POST /api/auth/login
// User login with email and password verification

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setAuthCookie } from '@/lib/cookies';
import bcrypt from 'bcryptjs';
import { validateEmail, AUTH_ERROR_CODES, type AuthErrorCode } from '@/lib/validation/auth';

function errorResponse(error: string, code: AuthErrorCode, status: number = 400) {
  return NextResponse.json({ success: false, error, code }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return errorResponse(emailValidation.error!, emailValidation.code!);
    }

    // Validate password is provided
    if (!password) {
      return errorResponse(
        'Please enter your password',
        AUTH_ERROR_CODES.PASSWORD_REQUIRED
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Use generic error message for security (don't reveal if email exists)
      return errorResponse(
        'Invalid email or password',
        AUTH_ERROR_CODES.CREDENTIALS_INVALID,
        401
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return errorResponse(
        'Invalid email or password',
        AUTH_ERROR_CODES.CREDENTIALS_INVALID,
        401
      );
    }

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier,
      reservationNumber: user.reservationNumber,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
    };

    // Set HTTP-only auth cookie
    await setAuthCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
      tier: user.tier,
    });

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
