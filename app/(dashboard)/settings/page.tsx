"use client";

import { useRouter } from 'next/navigation';
import { User, Shield, Bell, CreditCard, LogOut, ChevronRight } from 'lucide-react';
import { PageLayout } from '@/components/shared/layouts/PageLayout';
import { GlassCard } from '@/components/shared/glassmorphic/GlassCard';
import { useAuthStore } from '@/store/auth-store';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        {
          icon: <User size={20} />,
          label: 'Profile',
          description: 'Manage your account details',
          onClick: () => {},
        },
        {
          icon: <Shield size={20} />,
          label: 'Security',
          description: 'Password and authentication',
          onClick: () => {},
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: <Bell size={20} />,
          label: 'Notifications',
          description: 'Manage your notifications',
          onClick: () => {},
        },
        {
          icon: <CreditCard size={20} />,
          label: 'Payment Methods',
          description: 'Manage your cards and accounts',
          onClick: () => {},
        },
      ],
    },
  ];

  return (
    <PageLayout title="Settings" subtitle="Manage your preferences">
      <div className="space-y-6">
        {/* User Info Card */}
        <GlassCard variant="default" className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <span className="text-2xl font-bold text-white/80">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white">{user?.name || 'User'}</h3>
              <p className="text-sm text-white/40">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </GlassCard>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-3">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold px-2">
              {group.title}
            </h3>
            <div className="space-y-2">
              {group.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={item.onClick}
                  className="w-full group"
                >
                  <GlassCard variant="hover" className="flex items-center gap-4 p-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 group-hover:text-white group-hover:scale-105 transition-all duration-500">
                      {item.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                        {item.label}
                      </h4>
                      <p className="text-xs text-white/40">{item.description}</p>
                    </div>
                    <ChevronRight size={18} className="text-white/20 group-hover:text-white/40 transition-colors" />
                  </GlassCard>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all duration-300"
          >
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>

        {/* Version Info */}
        <div className="text-center pb-4">
          <p className="text-xs text-white/20">VEO Wealth v1.0.0</p>
        </div>
      </div>
    </PageLayout>
  );
}
