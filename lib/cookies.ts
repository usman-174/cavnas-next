import { cookies } from 'next/headers';

export const AUTH_COOKIE_NAME = 'cab-auth-session';

export interface AuthCookieData {
  userId: string;
  email: string;
  role: 'CLIENT' | 'ADMIN';
  tier: 'EARLY_BIRD' | 'REGULAR';
}

/**
 * Set the authentication cookie with user data
 * This cookie is HTTP-only and sent automatically with requests
 */
export async function setAuthCookie(data: AuthCookieData) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: JSON.stringify(data),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Get the authentication cookie data
 * Returns null if cookie doesn't exist or is invalid
 */
export async function getAuthCookie(): Promise<AuthCookieData | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/**
 * Clear the authentication cookie
 * Used for logout
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
