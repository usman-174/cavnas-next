"use client";

import { useRouter } from 'next/navigation';
import { ArrowUpRight, Building2, CreditCard, Landmark } from 'lucide-react';
import { PageLayout } from '@/components/shared/layouts/PageLayout';
import { WithdrawOption } from '@/components/withdrawals/WithdrawOption';

export default function WithdrawPage() {
  const router = useRouter();

  return (
    <PageLayout title="Withdraw" subtitle="Transfer funds to external accounts">
      <div className="space-y-6">
        {/* Withdrawal Methods */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold px-2">
            Select Method
          </h3>

          <WithdrawOption
            icon={<Landmark size={24} />}
            title="Bank Transfer"
            subtitle="1-3 business days"
            onClick={() => router.push('/withdraw/status')}
          />
          <WithdrawOption
            icon={<CreditCard size={24} />}
            title="Debit Card"
            subtitle="Instant • $25 fee"
            onClick={() => router.push('/withdraw/status')}
          />
          <WithdrawOption
            icon={<Building2 size={24} />}
            title="Wire Transfer"
            subtitle="Same day • $45 fee"
            onClick={() => router.push('/withdraw/status')}
          />
        </div>

        {/* Recent Withdrawals Placeholder */}
        <div className="mt-8">
          <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold px-2 mb-4">
            Recent Withdrawals
          </h3>
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <ArrowUpRight size={32} className="mx-auto text-white/20 mb-3" />
            <p className="text-sm text-white/40">No recent withdrawals</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
