"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { GlassLoading } from '@/components/shared/GlassLoading';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkSession, _hasHydrated, user } = useAuthStore();

  useEffect(() => {
    console.log('[Dashboard Layout] Checking session...');
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    console.log('[Dashboard Layout] State:', { _hasHydrated, isLoading, isAuthenticated, user });
    // Only redirect after hydration to prevent SSR mismatches
    if (_hasHydrated && !isLoading && !isAuthenticated) {
      console.log('[Dashboard Layout] Not authenticated, redirecting to /login');
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, _hasHydrated, router, user]);

  // Show glassmorphic loading animation while checking auth
  if (isLoading) {
    console.log('[Dashboard Layout] Showing glassmorphic loading animation');
    return <GlassLoading />;
  }

  // Don't render anything if not authenticated (will redirect)
  if (!_hasHydrated || !isAuthenticated) {
    console.log('[Dashboard Layout] Not rendering - hydrated:', _hasHydrated, 'authenticated:', isAuthenticated);
    return null;
  }

  console.log('[Dashboard Layout] Rendering children');
  return <>{children}</>;
}
