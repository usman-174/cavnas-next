"use client";

import { Crown, LogOut } from 'lucide-react';
import { CabUser } from '@/types';
import { useRouter, usePathname } from 'next/navigation';

interface AdminHeaderProps {
  user: CabUser | null;
  onLogout: () => void;
}

export function AdminHeader({ user, onLogout }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: 'users', label: 'Users', href: '/admin' },
    { id: 'tiers', label: 'Tiers', href: '/admin/tiers' },
  ];

  const isActiveTab = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo, Title & Navigation */}
          <div className="flex items-center gap-4">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <Crown size={18} className="text-amber-400" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white">Admin Dashboard</h1>
                <p className="text-xs text-white/40">CAB2Wealth Management</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="hidden sm:flex gap-1 p-1 rounded-lg border border-white/10 bg-white/[0.02]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => router.push(tab.href)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActiveTab(tab.href)
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* User & Actions */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm text-white/80">{user?.name}</div>
              <div className="text-xs text-white/40">{user?.email}</div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex gap-1 p-1 rounded-lg border border-white/10 bg-white/[0.02] -mt-2 mb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => router.push(tab.href)}
              className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isActiveTab(tab.href)
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
