"use client";

import { useState, useMemo } from 'react';
import { Filter, Search } from 'lucide-react';
import { PageLayout } from '@/components/shared/layouts/PageLayout';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { FilterPill } from '@/components/transactions/FilterPill';
import { useAppStore } from '@/store/app-store';

export default function TransactionsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { transactions } = useAppStore();

  // Placeholder transaction data (will use store data when available)
  const allTransactions = transactions.length > 0 ? transactions : [
    { id: '1', title: 'LVMH Moet Hennessy', subtitle: 'Investment Dividend', amount: '+$12,450.00', date: 'Today, 9:41 AM', type: 'credit' as const },
    { id: '2', title: 'Centurion Concierge', subtitle: 'Travel Booking', amount: '-$8,200.00', date: 'Yesterday', type: 'debit' as const },
    { id: '3', title: 'Private Banking', subtitle: 'Wire Transfer In', amount: '+$250,000.00', date: 'Jan 3, 2026', type: 'credit' as const },
    { id: '4', title: "Sotheby's Auction", subtitle: 'Art Purchase', amount: '-$45,000.00', date: 'Jan 2, 2026', type: 'debit' as const },
    { id: '5', title: 'Real Estate Fund', subtitle: 'Quarterly Distribution', amount: '+$62,500.00', date: 'Jan 1, 2026', type: 'credit' as const },
    { id: '6', title: 'Yacht Club', subtitle: 'Annual Membership', amount: '-$15,000.00', date: 'Dec 31, 2025', type: 'debit' as const },
  ];

  // Format amount for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Filter transactions based on search query and active filter
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(tx => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesFilter = activeFilter === 'All' ||
        (activeFilter === 'Credits' && tx.type === 'credit') ||
        (activeFilter === 'Debits' && tx.type === 'debit') ||
        activeFilter === 'This Month'; // Simplified for demo

      return matchesSearch && matchesFilter;
    });
  }, [allTransactions, searchQuery, activeFilter]);

  // Get display transactions with formatted amounts
  const displayTransactions = filteredTransactions.map(tx => ({
    ...tx,
    amount: typeof tx.amount === 'number'
      ? (tx.type === 'credit' ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`)
      : tx.amount,
  }));

  return (
    <PageLayout title="Transactions" subtitle="Account activity history">
      <div className="space-y-6">
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
            <Search size={18} className="text-white/30" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
            />
          </div>
          <button className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 cursor-pointer">
            <Filter size={18} className="text-white/40" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <FilterPill label="All" active={activeFilter === 'All'} onClick={() => setActiveFilter('All')} />
          <FilterPill label="Credits" active={activeFilter === 'Credits'} onClick={() => setActiveFilter('Credits')} />
          <FilterPill label="Debits" active={activeFilter === 'Debits'} onClick={() => setActiveFilter('Debits')} />
          <FilterPill label="This Month" active={activeFilter === 'This Month'} onClick={() => setActiveFilter('This Month')} />
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {displayTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              title={tx.title}
              subtitle={tx.subtitle}
              amount={tx.amount}
              date={tx.date}
              isPositive={tx.type === 'credit'}
            />
          ))}
        </div>

        {/* Load More Placeholder */}
        <button className="w-full py-3 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-white/40 hover:bg-white/[0.06] hover:text-white/60 transition-all duration-300 cursor-pointer">
          Load More
        </button>
      </div>
    </PageLayout>
  );
}
