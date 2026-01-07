"use client";

import { useAuthStore } from '@/store/auth-store';
import { GlassLoading } from '@/components/shared/GlassLoading';

/**
 * Dashboard Layout - Protected route layout
 *
 * This layout:
 * 1. Shows loading while auth state hydrates
 * 2. Renders children only when authenticated
 * 3. AuthProvider handles redirects if not authenticated
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  // Don't render anything until hydrated (prevents SSR mismatch)
  if (!_hasHydrated) {
    return <GlassLoading />;
  }

  // Show loading if not authenticated - AuthProvider will redirect
  if (!isAuthenticated) {
    return <GlassLoading />;
  }

  return <>{children}</>;
}
