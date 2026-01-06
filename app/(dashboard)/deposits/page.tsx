"use client";

import { useRouter } from 'next/navigation';
import { Plus, TrendingUp, Building } from 'lucide-react';
import { PageLayout } from '@/components/shared/layouts/PageLayout';
import { GlassCard } from '@/components/shared/glassmorphic/GlassCard';

export default function DepositsPage() {
  const router = useRouter();

  // Placeholder deposit data
  const deposits = [
    { id: '1', name: 'Real Estate Fund', type: 'Property', value: '$2,500,000', change: '+2.4%', positive: true },
    { id: '2', name: 'Private Equity', type: 'Investment', value: '$1,800,000', change: '+5.1%', positive: true },
    { id: '3', name: 'Art Collection', type: 'Collectibles', value: '$950,000', change: '-0.8%', positive: false },
  ];

  return (
    <PageLayout title="Asset Deposits" subtitle="Your deposited assets">
      <div className="space-y-6">
        {/* Summary Card */}
        <GlassCard variant="default" className="p-6">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Total Deposits</p>
          <h2 className="text-3xl font-light text-white mb-2">$5,250,000</h2>
          <div className="flex items-center gap-2 text-emerald-400/90 text-sm">
            <TrendingUp size={14} />
            <span>+$125,000 (2.4%) this month</span>
          </div>
        </GlassCard>

        {/* Deposits List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold">
              Your Assets
            </h3>
            <button className="text-xs text-white/40 hover:text-white/80 transition-colors flex items-center gap-1 cursor-pointer">
              <Plus size={14} />
              <span>Add Asset</span>
            </button>
          </div>

          {deposits.map((deposit) => (
            <button
              key={deposit.id}
              onClick={() => router.push(`/deposits/${deposit.id}`)}
              className="w-full group cursor-pointer"
            >
              <GlassCard variant="hover" className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/60 group-hover:text-white group-hover:scale-105 transition-all duration-500">
                    <Building size={24} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-medium text-white/90 tracking-wide group-hover:text-white transition-colors">
                      {deposit.name}
                    </h4>
                    <p className="text-xs text-white/40 tracking-wide">{deposit.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{deposit.value}</p>
                  <p className={`text-xs ${deposit.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {deposit.change}
                  </p>
                </div>
              </GlassCard>
            </button>
          ))}
        </div>

        {/* Empty State (hidden when deposits exist) */}
        {deposits.length === 0 && (
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <Building size={32} className="mx-auto text-white/20 mb-3" />
            <p className="text-sm text-white/40">No deposits yet</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
