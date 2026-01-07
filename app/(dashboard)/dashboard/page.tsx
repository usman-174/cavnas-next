"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, ArrowDownLeft, ArrowDown, List, Wallet, CreditCard } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAuthStore } from '@/store/auth-store';
import { useAppStore } from '@/store/app-store';
import { GlassModal } from '@/components/shared/Modal/GlassModal';
import { ActionButton } from '@/components/shared/glassmorphic/ActionButton';
import { CabLogoBadge } from '@/components/shared/logo/CabLogo';

// Loading skeleton component for modals
function ModalLoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-4 bg-white/10 rounded w-1/2" />
      <div className="h-20 bg-white/10 rounded" />
      <div className="h-4 bg-white/10 rounded w-2/3" />
    </div>
  );
}

// Dynamic imports for code splitting - these components will only load when the modal is opened
const CardsList = dynamic(() => import('@/features').then(m => ({ default: m.CardsList })), {
  loading: () => <ModalLoadingSkeleton />,
});

const HoldingsList = dynamic(() => import('@/features').then(m => ({ default: m.HoldingsList })), {
  loading: () => <ModalLoadingSkeleton />,
});

export default function DashboardPage() {
  const [loaded, setLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const router = useRouter();

  const { user, logout } = useAuthStore();
  const { balance, transactions, fetchBalance, fetchTransactions, activeModal, setActiveModal } = useAppStore();

  const handleMenuClick = () => {
    router.push('/settings');
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const displayBalance = balance?.total ?? 8240192;
  const displayChange = balance?.change ?? 24012;
  const displayChangePercent = balance?.changePercent ?? 0.29;
  const displayPeriod = balance?.period ?? 'Today';

  const displayTransactions = transactions.length > 0
    ? transactions.slice(0, 2)
    : [
        { id: '1', title: 'LVMH Moet Hennessy', subtitle: 'Investment Dividend', amount: 12450, date: 'Today, 9:41 AM', type: 'credit' as const },
        { id: '2', title: 'Centurion Concierge', subtitle: 'Travel Booking', amount: 8200, date: 'Yesterday', type: 'debit' as const },
      ];

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden font-sans selection:bg-white/20">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60 transition-opacity duration-2000"
            onError={() => setVideoError(true)}
          >
            <source src="/videos/background.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full bg-linear-to-br from-slate-900 via-[#0a0a0a] to-black" />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
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
        <header
          className={`w-full flex justify-between items-center transition-all duration-1000 ease-out transform ${loaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
        >
          <CabLogoBadge />
          <button
            onClick={handleMenuClick}
            className="p-2 rounded-full hover:bg-white/5 transition-colors duration-500 cursor-pointer"
          >
            <div className="w-6 h-6 flex flex-col items-end justify-center gap-1.5">
              <span className="w-6 h-[1px] bg-white/80"></span>
              <span className="w-4 h-[1px] bg-white/80"></span>
            </div>
          </button>
        </header>

        {/* Centerpiece: Balance */}
        <main className="flex-1 flex flex-col items-center justify-center w-full text-center mt-[-40px]">

          {/* Label */}
          <div
            className={`mb-6 transition-all duration-1500 delay-300 ease-out transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <span className="px-4 py-1.5 rounded-full border border-white/10 bg-black/20 backdrop-blur-xl text-[10px] uppercase tracking-[0.3em] text-white/60 font-medium">
              Total Wealth
            </span>
          </div>

          {/* Amount */}
          <div
            className={`relative transition-all duration-1500 delay-500 ease-out transform ${loaded ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-12 opacity-0 blur-sm'}`}
          >
            <h1 className="text-6xl md:text-8xl font-light tracking-tight text-white drop-shadow-2xl">
              <span className="text-4xl md:text-6xl align-top opacity-50 mr-2">$</span>
              {formatAmount(displayBalance)}
            </h1>
            <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400/90 text-sm font-medium tracking-wide">
              <ArrowUpRight size={16} strokeWidth={1.5} />
              <span>+${formatAmount(displayChange)} ({displayChangePercent}%)</span>
              <span className="text-white/20 mx-2">|</span>
              <span className="text-white/40 font-light">{displayPeriod}</span>
            </div>
          </div>

        </main>

        {/* Bottom Section: Actions & List */}
        <div
          className={`w-full space-y-8 transition-all duration-1500 delay-700 ease-out transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
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

          {/* Mini Transaction List */}
          <div className="w-full">
            <div className="flex justify-between items-end mb-4 px-2">
              <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold">Recent Movement</h3>
            </div>

            <div className="space-y-3">
              {displayTransactions.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  title={tx.title}
                  subtitle={tx.subtitle}
                  amount={tx.type === 'credit' ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                  date={tx.date}
                  isPositive={tx.type === 'credit'}
                />
              ))}
            </div>
          </div>

        </div>
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

function TransactionItem({ title, subtitle, amount, date, isPositive }: {
  title: string;
  subtitle: string;
  amount: string;
  date: string;
  isPositive: boolean;
}) {
  return (
    <div className="group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 backdrop-blur-md transition-all duration-500 cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 group-hover:text-white group-hover:scale-105 transition-all duration-500">
          {isPositive ? <ArrowDownLeft size={18} strokeWidth={1} /> : <ArrowUpRight size={18} strokeWidth={1} />}
        </div>
        <div>
          <h4 className="text-sm font-medium text-white/90 tracking-wide group-hover:text-white transition-colors">{title}</h4>
          <p className="text-xs text-white/40 tracking-wide">{subtitle}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`block text-sm font-medium tracking-wide ${isPositive ? 'text-emerald-400/90' : 'text-white/90'}`}>
          {amount}
        </span>
        <span className="text-[10px] text-white/30 tracking-wider uppercase">{date}</span>
      </div>
    </div>
  );
}
