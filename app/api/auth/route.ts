// POST /api/auth/register
// User registration with tier selection and automatic reservation number assignment

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setAuthCookie } from '@/lib/cookies';
import { TierType } from '@/types';
import bcrypt from 'bcryptjs';
import {
  validateEmail,
  validatePassword,
  validateName,
  AUTH_ERROR_CODES,
  type AuthErrorCode,
} from '@/lib/validation/auth';

// In-memory rate limiting map (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 3; // Max 3 registrations per window per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

function errorResponse(error: string, code: AuthErrorCode, status: number = 400) {
  return NextResponse.json({ success: false, error, code }, { status });
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return errorResponse(
        'Too many registration attempts. Please try again later.',
        AUTH_ERROR_CODES.RATE_LIMITED,
        429
      );
    }

    const body = await request.json();
    const { email, password, name, tier } = body;

    // Validate using shared validation utilities
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return errorResponse(nameValidation.error!, nameValidation.code!);
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return errorResponse(emailValidation.error!, emailValidation.code!);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return errorResponse(passwordValidation.error!, passwordValidation.code!);
    }

    // Validate tier
    if (!tier) {
      return errorResponse('Please select a tier', AUTH_ERROR_CODES.TIER_REQUIRED);
    }

    if (!Object.values(TierType).includes(tier)) {
      return errorResponse('Invalid tier selected', AUTH_ERROR_CODES.TIER_INVALID);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return errorResponse(
        'An account with this email already exists',
        AUTH_ERROR_CODES.EMAIL_EXISTS,
        409
      );
    }

    // Check tier capacity
    const tierCapacity = await prisma.tierCapacity.findUnique({
      where: { tier },
    });

    if (!tierCapacity) {
      return NextResponse.json(
        { success: false, error: 'Tier configuration not found. Please contact support.' },
        { status: 500 }
      );
    }

    if (tierCapacity.currentCount >= tierCapacity.capacity) {
      return errorResponse(
        `Sorry, the ${tier === 'EARLY_BIRD' ? 'Early Bird' : 'Regular'} tier is currently full. Please check back later.`,
        AUTH_ERROR_CODES.TIER_FULL
      );
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 12);

    // Get next reservation number for the tier
    const tierUserCount = await prisma.user.count({
      where: { tier },
    });
    const reservationNumber = tierUserCount + 1;

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name: name.trim(),
        tier: tier as TierType,
        reservationNumber,
        status: 'PENDING',
        role: 'CLIENT',
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

    // Update tier capacity
    await prisma.tierCapacity.update({
      where: { tier },
      data: {
        currentCount: {
          increment: 1,
        },
      },
    });

    // Set HTTP-only auth cookie
    await setAuthCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
      tier: user.tier,
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
