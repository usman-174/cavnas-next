"use client";

import { useParams, useRouter } from 'next/navigation';
import { ArrowUpRight, TrendingUp, TrendingDown, Calendar, Building2 } from 'lucide-react';
import { PageLayout } from '@/components/shared/layouts/PageLayout';
import { GlassCard } from '@/components/shared/glassmorphic/GlassCard';

export default function DepositDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Mock deposit data - in real app, fetch based on id
  const deposit = {
    id: id,
    name: 'Real Estate Fund',
    type: 'Property',
    value: 2500000,
    change: 2.4,
    changeAmount: 60000,
    positive: true,
    description: 'Diversified real estate investment portfolio focusing on commercial properties in prime locations.',
    depositedDate: 'Jan 15, 2024',
    lastUpdate: 'Today',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const history = [
    { id: '1', date: 'Jan 1, 2026', description: 'Quarterly Distribution', amount: '+$60,000', type: 'credit' },
    { id: '2', date: 'Oct 1, 2025', description: 'Quarterly Distribution', amount: '+$58,500', type: 'credit' },
    { id: '3', date: 'Jul 1, 2025', description: 'Quarterly Distribution', amount: '+$57,000', type: 'credit' },
    { id: '4', date: 'Apr 1, 2025', description: 'Quarterly Distribution', amount: '+$55,500', type: 'credit' },
  ];

  return (
    <PageLayout title={deposit.name} subtitle={deposit.type}>
      <div className="space-y-6">
        {/* Value Card */}
        <GlassCard variant="default" className="p-6">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Current Value</p>
          <h2 className="text-4xl font-light text-white mb-3">{formatCurrency(deposit.value)}</h2>
          <div className={`flex items-center gap-2 text-sm ${deposit.positive ? 'text-emerald-400/90' : 'text-red-400/90'}`}>
            {deposit.positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>
              {deposit.positive ? '+' : ''}{formatCurrency(deposit.changeAmount)} ({deposit.positive ? '+' : ''}{deposit.change}%)
            </span>
            <span className="text-white/20 mx-2">|</span>
            <span className="text-white/40">This month</span>
          </div>
        </GlassCard>

        {/* Details Card */}
        <GlassCard variant="default" className="p-6 space-y-4">
          <h3 className="text-sm font-medium text-white/90 uppercase tracking-wider">Details</h3>
          <p className="text-sm text-white/60 leading-relaxed">{deposit.description}</p>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Calendar size={14} />
            <span>Deposited: {deposit.depositedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Building2 size={14} />
            <span>Last updated: {deposit.lastUpdate}</span>
          </div>
        </GlassCard>

        {/* Distribution History */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold px-2">
            Distribution History
          </h3>
          <div className="space-y-3">
            {history.map((item) => (
              <GlassCard key={item.id} variant="hover" className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${item.type === 'credit' ? 'bg-emerald-400/10' : 'bg-white/5'} flex items-center justify-center`}>
                    <ArrowUpRight size={16} className={item.type === 'credit' ? 'text-emerald-400' : 'text-white/60'} />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">{item.description}</p>
                    <p className="text-xs text-white/40">{item.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${item.type === 'credit' ? 'text-emerald-400/90' : 'text-white/90'}`}>
                  {item.amount}
                </span>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
