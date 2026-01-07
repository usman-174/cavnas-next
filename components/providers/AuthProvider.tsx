"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { GlassLoading } from '@/components/shared/GlassLoading';

/**
 * AuthProvider - Centralized authentication management
 *
 * This provider:
 * 1. Prevents hydration mismatch by always rendering consistent UI
 * 2. Centralizes auth state checks and redirects
 * 3. Initializes auth state once on mount
 * 4. Handles routing based on auth status
 *
 * Public routes: '/', '/login'
 * Protected routes: '/dashboard/*'
 */

// Routes that don't require authentication
const publicRoutes = ['/', '/login'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, _hasHydrated, checkSession } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route)
  );

  // Check if current route is a dashboard route (protected)
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // We're loading while auth state hydrates and initializes
  const isLoading = !_hasHydrated || !isInitialized;

  // Initialize auth state on mount
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      // Only check session if we have persisted auth data
      // This prevents unnecessary loading on first visit
      await checkSession();
      if (!cancelled) {
        setIsInitialized(true);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [checkSession]);

  // Handle auth-based redirects
  useEffect(() => {
    // Don't redirect while still loading
    if (isLoading) return;

    // Redirect to login if not authenticated and trying to access dashboard
    if (!isAuthenticated && isDashboardRoute) {
      router.replace('/login');
      return;
    }

    // Redirect to dashboard if already authenticated and on login page
    if (isAuthenticated && pathname === '/login') {
      router.replace('/dashboard');
      return;
    }
  }, [isAuthenticated, pathname, isDashboardRoute, isLoading, router]);

  // Always show loading while initializing to prevent hydration mismatch
  if (isLoading) {
    return <GlassLoading />;
  }

  // For dashboard routes, show loading until authenticated (AuthProvider will redirect)
  if (isDashboardRoute && !isAuthenticated) {
    return <GlassLoading />;
  }

  return <>{children}</>;
}
