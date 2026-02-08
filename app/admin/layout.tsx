"use client";

import { useAuthStore } from '@/store/auth-store';
import { GlassLoading } from '@/components/shared/GlassLoading';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Admin Layout - Protected admin-only layout
 *
 * This layout:
 * 1. Shows loading while auth state hydrates
 * 2. Redirects non-admin users to /dashboard
 * 3. Renders children only when authenticated as ADMIN
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, _hasHydrated, isAdmin } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (_hasHydrated && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    // If authenticated but not admin, redirect to dashboard
    if (_hasHydrated && isAuthenticated && !isAdmin()) {
      router.replace('/dashboard');
      return;
    }
  }, [_hasHydrated, isAuthenticated, isAdmin, router, pathname]);

  // Don't render anything until hydrated
  if (!_hasHydrated) {
    return <GlassLoading />;
  }

  // Show loading if not authenticated or not admin
  if (!isAuthenticated || !isAdmin()) {
    return <GlassLoading />;
  }

  return <>{children}</>;
}
