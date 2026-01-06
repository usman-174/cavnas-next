import { useCallback } from 'react';
import { useAppStore } from '@/store';

export interface TransferParams {
  recipient: string;
  amount: number;
  currency: string;
  cardId?: string;
  note?: string;
}

export function useTransfers() {
  const { balance, addTransaction } = useAppStore();

  const getAvailableBalance = useCallback((currency: string): number => {
    const currencyBalance = balance?.[currency];
    if (currencyBalance && typeof currencyBalance === 'object' && 'available' in currencyBalance) {
      return currencyBalance.available;
    }
    return 0;
  }, [balance]);

  const sendTransfer = useCallback((params: TransferParams) => {
    const availableBalance = getAvailableBalance(params.currency);

    if (params.amount > availableBalance) {
      throw new Error('Insufficient funds');
    }

    // Create transaction record
    const transaction = {
      id: `tx-${Date.now()}`,
      title: `Transfer to ${params.recipient}`,
      subtitle: params.note || 'Transfer',
      amount: params.amount,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      type: 'debit' as const,
    };

    addTransaction(transaction);

    return transaction;
  }, [balance, addTransaction, getAvailableBalance]);

  const validateTransfer = useCallback((params: TransferParams): { valid: boolean; error?: string } => {
    if (!params.recipient.trim()) {
      return { valid: false, error: 'Recipient is required' };
    }

    if (params.amount <= 0) {
      return { valid: false, error: 'Amount must be greater than 0' };
    }

    const availableBalance = getAvailableBalance(params.currency);
    if (params.amount > availableBalance) {
      return { valid: false, error: 'Insufficient funds' };
    }

    return { valid: true };
  }, [balance, getAvailableBalance]);

  return {
    sendTransfer,
    validateTransfer,
  };
}
