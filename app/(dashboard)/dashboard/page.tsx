"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, ArrowDownLeft, ArrowDown, List, Wallet, CreditCard, Hash, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useAuthStore } from '@/store/auth-store';
import { useAppStore } from '@/store/app-store';
import { GlassModal } from '@/components/shared/Modal/GlassModal';
import { ActionButton } from '@/components/shared/glassmorphic/ActionButton';
import { CabLogoBadge } from '@/components/shared/logo/CabLogo';
import { TierType } from '@/types';
import Link from 'next/link';

// Loading skeleton component for modals
function ModalLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-4 bg-white/10 rounded w-1/2" />
      <div className="h-20 bg-white/10 rounded" />
      <div className="h-4 bg-white/10 rounded w-2/3" />
    </div>
  );
}

// Dynamic imports for code splitting
const CardsList = dynamic(() => import('@/features').then(m => ({ default: m.CardsList })), {
  loading: () => <ModalLoadingSkeleton />,
});

const HoldingsList = dynamic(() => import('@/features').then(m => ({ default: m.HoldingsList })), {
  loading: () => <ModalLoadingSkeleton />,
});

export default function DashboardPage() {
  const [videoError, setVideoError] = useState(false);
  const router = useRouter();

  const { user, logout } = useAuthStore();
  const { balance, transactions, fetchBalance, fetchTransactions, activeModal, setActiveModal } = useAppStore();

  const handleMenuClick = () => {
    router.push('/settings');
  };

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Get tier display info
  const getTierInfo = (tier?: TierType) => {
    switch (tier) {
      case TierType.EARLY_BIRD:
        return { name: 'Early Bird', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' };
      case TierType.REGULAR:
        return { name: 'Regular', color: 'text-white/70', bgColor: 'bg-white/5', borderColor: 'border-white/20' };
      default:
        return { name: 'Standard', color: 'text-white/50', bgColor: 'bg-white/5', borderColor: 'border-white/10' };
    }
  };

  const tierInfo = getTierInfo(user?.tier);

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden font-sans selection:bg-white/20">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60 pointer-events-none"
            onError={() => setVideoError(true)}
          >
            <source src="/videos/background.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-[#0a0a0a] to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-between px-6 py-12 md:py-20 max-w-md mx-auto md:max-w-2xl">

        {/* Header / Nav */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full flex justify-between items-center"
        >
          <CabLogoBadge />
          <Link
            href="/settings"
            className="p-2 rounded-full hover:bg-white/5 transition-colors duration-500 cursor-pointer relative z-20"
          >
            <div className="w-6 h-6 flex flex-col items-end justify-center gap-1.5">
              <span className="w-6 h-[1px] bg-white/80"></span>
              <span className="w-4 h-[1px] bg-white/80"></span>
            </div>
          </Link>
        </motion.header>

        {/* Centerpiece: Balance & Reservation */}
        <main className="flex-1 flex flex-col items-center justify-center w-full text-center mt-[-40px]">

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg shadow-black/20">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold bg-gradient-to-r from-white/80 to-white/40 bg-clip-text text-transparent">
                Total Wealth
              </span>
            </div>
          </motion.div>

          {/* Amount - Infinity Symbol */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.15, ease: "circOut" }}
            className="relative"
          >
            {/* Glow effect behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none" />

            <div className="relative flex items-center justify-center">
              <span className="text-4xl md:text-5xl font-light text-white/30 mr-4 align-top translate-y-[-4px]">$</span>
              <span className="text-8xl md:text-9xl font-thin tracking-tighter bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                ∞
              </span>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center gap-1">
              <p className="text-lg text-white/80 font-light tracking-wide">Unlimited Potential</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500/50 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Assets Being Built</p>
              </div>
            </div>
          </motion.div>

          {/* Reservation Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 w-full"
          >
            <div className={`p-6 rounded-2xl border ${tierInfo.borderColor} ${tierInfo.bgColor} backdrop-blur-xl`}>
              {/* Tier Badge */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown size={16} className={tierInfo.color} />
                <span className={`text-xs uppercase tracking-wider ${tierInfo.color} font-medium`}>
                  {tierInfo.name} Tier
                </span>
              </div>

              {/* Reservation Number */}
              <div className="flex items-center justify-center gap-3">
                <Hash size={20} className="text-white/60" />
                <div>
                  <div className="text-2xl font-light text-white">
                    #{user?.reservationNumber || '---'}
                  </div>
                  <div className="text-xs text-white/40">Reservation Number</div>
                </div>
              </div>

              {/* Positioning Info */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-white/50 leading-relaxed">
                  Your position in the queue determines your priority for asset allocation.
                  Early registrants receive preferential positioning in the co-investment pool.
                </p>
              </div>
            </div>
          </motion.div>

        </main>

        {/* Bottom Section: Actions */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full space-y-8"
        >

          {/* Quick Actions - Floating Glass Bar */}
          <div className="flex justify-center">
            <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl shadow-black/50">
              <ActionButton icon={<ArrowDown size={20} />} label="Withdraw" onClick={() => router.push('/withdraw')} />
              <ActionButton icon={<ArrowUpRight size={20} />} label="Deposit" onClick={() => router.push('/deposits')} />
              <ActionButton icon={<Wallet size={20} />} label="Holdings" onClick={() => setActiveModal('holdings')} />
              <ActionButton icon={<CreditCard size={20} />} label="Cards" onClick={() => setActiveModal('cards')} />
              <ActionButton icon={<List size={20} />} label="Activity" onClick={() => router.push('/transactions')} />
            </div>
          </div>

        </motion.div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-blue-900/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      {/* Modals */}
      <GlassModal modalType="cards" title="Cards">
        <CardsList />
      </GlassModal>

      <GlassModal modalType="holdings" title="Holdings">
        <HoldingsList />
      </GlassModal>
    </div>
  );
}
