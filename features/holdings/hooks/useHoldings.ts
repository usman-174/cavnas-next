import { useCallback } from 'react';
import { useAppStore } from '@/store';

export function useHoldings() {
  const { holdings, isLoadingHoldings } = useAppStore();

  // Memoized filtering and sorting can be done at component level
  // This hook provides the raw data and loading state

  return {
    holdings,
    isLoading: isLoadingHoldings,
  };
}
