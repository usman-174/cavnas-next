import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ModalType, Balance, Transaction, Holding, Card } from '@/types';

interface AppStore {
  // Modal state
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;

  // Financial data
  balance: Balance | null;
  transactions: Transaction[];
  holdings: Holding[];
  cards: Card[];

  // Loading states
  isLoadingBalance: boolean;
  isLoadingTransactions: boolean;
  isLoadingHoldings: boolean;
  isLoadingCards: boolean;

  // Actions
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchHoldings: () => Promise<void>;
  fetchCards: () => Promise<void>;
  setCards: (cards: Card[]) => void;
  fetchAllData: () => Promise<void>;
  sendMoney: (to: string, amount: number) => Promise<boolean>;
  addTransaction: (transaction: Transaction) => void;

  // SSR hydration flag
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// Mock API functions
const mockFinancialApi = {
  getBalance: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      data: {
        total: 8240192,
        change: 24012,
        changePercent: 0.29,
        period: 'Today',
        USD: { available: 125000, total: 500000, change: 1200 },
        EUR: { available: 45000, total: 85000, change: -500 },
        GBP: { available: 32000, total: 60000, change: 200 },
        BTC: { available: 0.5, total: 1.2, change: 0.05 },
      },
    };
  },

  getTransactions: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      success: true,
      data: [
        {
          id: '1',
          title: 'LVMH Moet Hennessy',
          subtitle: 'Investment Dividend',
          amount: 12450,
          date: 'Today, 9:41 AM',
          type: 'credit' as const,
        },
        {
          id: '2',
          title: 'Centurion Concierge',
          subtitle: 'Travel Booking',
          amount: 8200,
          date: 'Yesterday',
          type: 'debit' as const,
        },
        {
          id: '3',
          title: 'Private Banking',
          subtitle: 'Wire Transfer In',
          amount: 250000,
          date: 'Jan 3, 2026',
          type: 'credit' as const,
        },
        {
          id: '4',
          title: "Sotheby's Auction",
          subtitle: 'Art Purchase',
          amount: 45000,
          date: 'Jan 2, 2026',
          type: 'debit' as const,
        },
        {
          id: '5',
          title: 'Real Estate Fund',
          subtitle: 'Quarterly Distribution',
          amount: 62500,
          date: 'Jan 1, 2026',
          type: 'credit' as const,
        },
      ],
    };
  },

  getHoldings: async () => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return {
      success: true,
      data: [
        {
          id: '1',
          name: 'Apple Inc.',
          symbol: 'AAPL',
          value: 245000,
          quantity: 1500,
          currentPrice: 175.50,
          change24h: 1.25,
          volume24h: 52000000000,
          marketCap: 2750000000000,
        },
        {
          id: '2',
          name: 'Microsoft',
          symbol: 'MSFT',
          value: 189000,
          quantity: 600,
          currentPrice: 415.25,
          change24h: -0.45,
          volume24h: 18000000000,
          marketCap: 3080000000000,
        },
        {
          id: '3',
          name: 'Bitcoin',
          symbol: 'BTC',
          value: 425000,
          quantity: 5.2,
          currentPrice: 81730.77,
          change24h: 2.15,
          volume24h: 35000000000,
          marketCap: 1600000000000,
        },
        {
          id: '4',
          name: 'Ethereum',
          symbol: 'ETH',
          value: 185000,
          quantity: 450,
          currentPrice: 411.11,
          change24h: 1.85,
          volume24h: 18000000000,
          marketCap: 494000000000,
        },
        {
          id: '5',
          name: 'Tesla',
          symbol: 'TSLA',
          value: 95000,
          quantity: 400,
          currentPrice: 237.50,
          change24h: -1.30,
          volume24h: 9500000000,
          marketCap: 756000000000,
        },
      ],
    };
  },

  getCards: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: [
        {
          id: 'card-1',
          name: 'John Doe',
          number: '378282246310005',
          last4: '0005',
          expiry: '12/28',
          brand: 'amex' as const,
          balance: 50000,
        },
        {
          id: 'card-2',
          name: 'John Doe',
          number: '4532015112830366',
          last4: '0366',
          expiry: '08/27',
          brand: 'visa' as const,
          balance: 125000,
        },
      ],
    };
  },

  sendMoney: async (to: string, amount: number) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Simulate successful transfer
    return {
      success: true,
      data: { transactionId: Date.now().toString() },
    };
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      activeModal: null,
      balance: null,
      transactions: [],
      holdings: [],
      cards: [],
      isLoadingBalance: false,
      isLoadingTransactions: false,
      isLoadingHoldings: false,
      isLoadingCards: false,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setActiveModal: (modal) => set({ activeModal: modal }),

      fetchBalance: async () => {
        set({ isLoadingBalance: true });
        try {
          const response = await mockFinancialApi.getBalance();
          if (response.success) {
            set({ balance: response.data });
          }
        } finally {
          set({ isLoadingBalance: false });
        }
      },

      fetchTransactions: async () => {
        set({ isLoadingTransactions: true });
        try {
          const response = await mockFinancialApi.getTransactions();
          if (response.success) {
            set({ transactions: response.data });
          }
        } finally {
          set({ isLoadingTransactions: false });
        }
      },

      fetchHoldings: async () => {
        set({ isLoadingHoldings: true });
        try {
          const response = await mockFinancialApi.getHoldings();
          if (response.success) {
            set({ holdings: response.data });
          }
        } finally {
          set({ isLoadingHoldings: false });
        }
      },

      fetchCards: async () => {
        set({ isLoadingCards: true });
        try {
          const response = await mockFinancialApi.getCards();
          if (response.success) {
            set({ cards: response.data });
          }
        } finally {
          set({ isLoadingCards: false });
        }
      },

      setCards: (cards) => set({ cards }),

      fetchAllData: async () => {
        const { fetchBalance, fetchTransactions, fetchHoldings, fetchCards } = get();
        await Promise.all([
          fetchBalance(),
          fetchTransactions(),
          fetchHoldings(),
          fetchCards(),
        ]);
      },

      sendMoney: async (to: string, amount: number) => {
        try {
          const response = await mockFinancialApi.sendMoney(to, amount);
          if (response.success) {
            // Refresh data after sending
            const { fetchBalance, fetchTransactions } = get();
            await Promise.all([fetchBalance(), fetchTransactions()]);
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      addTransaction: (transaction: Transaction) => {
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        }));
      },
    }),
    {
      name: 'veo-app-storage',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      // Don't persist loading states or modals
      partialize: (state) => ({
        balance: state.balance,
        transactions: state.transactions,
        holdings: state.holdings,
        cards: state.cards,
      }),
    }
  )
);

// Selector hooks for optimized subscriptions
// These prevent unnecessary re-renders by only subscribing to specific state slices
export const useBalance = () => useAppStore((state) => state.balance);
export const useTransactions = () => useAppStore((state) => state.transactions);
export const useHoldings = () => useAppStore((state) => state.holdings);
export const useCards = () => useAppStore((state) => state.cards);
export const useActiveModal = () => useAppStore((state) => state.activeModal);
export const useIsLoading = () => useAppStore((state) => ({
  isLoadingBalance: state.isLoadingBalance,
  isLoadingTransactions: state.isLoadingTransactions,
  isLoadingHoldings: state.isLoadingHoldings,
  isLoadingCards: state.isLoadingCards,
}));
