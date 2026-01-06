"use client";

import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock, ArrowUpRight } from 'lucide-react';
import { PageLayout } from '@/components/shared/layouts/PageLayout';
import { GlassCard } from '@/components/shared/glassmorphic/GlassCard';

export default function WithdrawStatusPage() {
  const router = useRouter();

  // Mock withdrawal data
  const withdrawal = {
    id: 'WTD-2026-001',
    amount: 50000,
    method: 'Bank Transfer',
    status: 'processing',
    estimatedTime: '1-3 business days',
    initiatedDate: 'Today, 2:30 PM',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const timeline = [
    { step: 1, title: 'Initiated', description: 'Withdrawal request submitted', time: 'Today, 2:30 PM', completed: true },
    { step: 2, title: 'Processing', description: 'Being processed by our team', time: 'In progress', completed: false },
    { step: 3, title: 'Transfer Initiated', description: 'Transfer to your bank', time: 'Pending', completed: false },
    { step: 4, title: 'Completed', description: 'Funds in your account', time: 'Pending', completed: false },
  ];

  return (
    <PageLayout title="Withdrawal Status" subtitle={`ID: ${withdrawal.id}`} showLogo={false}>
      <div className="space-y-6">
        {/* Status Card */}
        <GlassCard variant="default" className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-400/10 flex items-center justify-center">
            <Clock size={32} className="text-amber-400" />
          </div>
          <h2 className="text-2xl font-light text-white mb-2">
            {formatCurrency(withdrawal.amount)}
          </h2>
          <p className="text-sm text-white/60 mb-4">{withdrawal.method}</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20">
            <Clock size={14} className="text-amber-400" />
            <span className="text-sm text-amber-400">Processing</span>
          </div>
          <p className="text-xs text-white/40 mt-4">
            Estimated arrival: {withdrawal.estimatedTime}
          </p>
        </GlassCard>

        {/* Timeline */}
        <GlassCard variant="default" className="p-6">
          <h3 className="text-sm font-medium text-white/90 uppercase tracking-wider mb-6">
            Transaction Timeline
          </h3>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.completed
                        ? 'bg-emerald-400/20 border-2 border-emerald-400'
                        : 'bg-white/5 border-2 border-white/10'
                    }`}
                  >
                    {item.completed ? (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/30" />
                    )}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className={`w-0.5 flex-1 mt-2 ${item.completed ? 'bg-emerald-400/30' : 'bg-white/10'}`} />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <h4 className={`text-sm font-medium ${item.completed ? 'text-white' : 'text-white/60'}`}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/40 mt-1">{item.description}</p>
                  <p className="text-xs text-white/30 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/withdraw')}
            className="flex-1 py-3 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white/80 hover:bg-white/[0.06] transition-all duration-300"
          >
            New Withdrawal
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 text-sm text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Back to Dashboard</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
