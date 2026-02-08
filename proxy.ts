// CAB2Wealth Proxy
// Protects admin routes and handles auth redirects
// Next.js 16 uses "proxy" instead of "middleware"

import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/cookies';

// Define protected and public routes
const protectedRoutes = ['/dashboard'];
const adminRoutes = ['/admin'];
const publicRoutes = ['/', '/login'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth cookie
  const authCookieValue = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let userRole: string | null = null;
  let isAuthenticated = false;

  if (authCookieValue) {
    try {
      const parsed = JSON.parse(authCookieValue);
      userRole = parsed?.role || null;
      isAuthenticated = !!userRole;
    } catch {
      // Invalid cookie format
    }
  }



  // Allow public routes (except /login which has special handling below)
  if (publicRoutes.some(route => pathname === route && route !== '/login')) {
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      console.log('[PROXY] Not authenticated for dashboard, redirecting to login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin routes - check for admin role in cookie
  if (adminRoutes.some(route => pathname.includes(route))) {
    console.log('[PROXY] Admin route detected');
    if (!isAuthenticated) {
      console.log('[PROXY] Not authenticated, redirecting to login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== 'ADMIN') {
      // Not an admin, redirect to dashboard
      console.log('[PROXY] Not admin, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Redirect authenticated users from login to appropriate dashboard
  if (pathname === '/login' && isAuthenticated) {
    const redirectUrl = userRole === 'ADMIN' ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes that handle their own auth
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
