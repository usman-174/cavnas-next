"use client";

import { useState, useCallback, useMemo } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldContent,
  FieldDescription,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store';
import { useTransfers } from '../hooks';
import { formatCurrency } from '@/lib';

interface RecentRecipient {
  id: string;
  name: string;
  avatar: string;
  lastUsed: string;
}

const RECENT_RECIPIENTS: RecentRecipient[] = [
  { id: '1', name: 'Alice Johnson', avatar: 'A', lastUsed: '2 days ago' },
  { id: '2', name: 'Bob Smith', avatar: 'B', lastUsed: '1 week ago' },
  { id: '3', name: 'Carol Williams', avatar: 'C', lastUsed: '2 weeks ago' },
];

interface SendFormProps {
  onSuccess?: () => void;
}

export function SendForm({ onSuccess }: SendFormProps) {
  const { balance, cards, setActiveModal } = useAppStore();
  const { sendTransfer, validateTransfer } = useTransfers();

  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [selectedCard, setSelectedCard] = useState(cards[0]?.id || '');
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const availableBalance = useMemo(() => {
    const currencyBalance = balance?.[selectedCurrency];
    if (currencyBalance && typeof currencyBalance === 'object' && 'available' in currencyBalance) {
      return currencyBalance.available;
    }
    return 0;
  }, [balance, selectedCurrency]);

  const maxAmount = useMemo(
    () => availableBalance.toFixed(2),
    [availableBalance]
  );

  const handleQuickAmount = useCallback((percent: number) => {
    const value = (availableBalance * percent).toFixed(2);
    setAmount(value);
  }, [availableBalance]);

  const handleSend = useCallback(async () => {
    setError(null);

    try {
      const validation = validateTransfer({
        recipient,
        amount: parseFloat(amount),
        currency: selectedCurrency,
        cardId: selectedCard,
        note,
      });

      if (!validation.valid) {
        setError(validation.error || 'Invalid transfer');
        return;
      }

      setIsSending(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      sendTransfer({
        recipient,
        amount: parseFloat(amount),
        currency: selectedCurrency,
        cardId: selectedCard,
        note,
      });

      // Reset form
      setAmount('');
      setRecipient('');
      setNote('');

      onSuccess?.();
      setActiveModal(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed');
    } finally {
      setIsSending(false);
    }
  }, [recipient, amount, selectedCurrency, selectedCard, note, validateTransfer, sendTransfer, onSuccess, setActiveModal]);

  const isValid = useMemo(() => {
    return !!amount && !!recipient && parseFloat(amount) > 0 && parseFloat(amount) <= availableBalance;
  }, [amount, recipient, availableBalance]);

  return (
    <div className="space-y-6">
      {/* Currency Selector */}
      <Field>
        <FieldLabel>Currency</FieldLabel>
        <FieldContent>
          <select
            name="currency"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full h-7 rounded-md border border-white/10 bg-white/[0.02] px-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="BTC">BTC - Bitcoin</option>
          </select>
          <FieldDescription>
            Available: <span className="text-emerald-400/90">{availableBalance.toLocaleString()} {selectedCurrency}</span>
          </FieldDescription>
        </FieldContent>
      </Field>

      {/* Recipient Input */}
      <Field>
        <FieldLabel>Recipient</FieldLabel>
        <FieldContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-white/40" />
            <Input
              placeholder="Search by name, email, or wallet address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="glass border-white/10 text-white bg-white/[0.02] pl-8 placeholder:text-white/30"
            />
          </div>
        </FieldContent>
      </Field>

      {/* Recent Recipients */}
      {recipient === '' && (
        <div className="space-y-3">
          <FieldDescription>Recent recipients</FieldDescription>
          <div className="space-y-2">
            {RECENT_RECIPIENTS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRecipient(r.name)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg glass-card border-white/5 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="size-9 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-sm font-medium text-white/80">
                  {r.avatar}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm text-white/90">{r.name}</div>
                  <div className="text-xs text-white/40">{r.lastUsed}</div>
                </div>
                <ArrowUpRight className="size-4 text-white/30" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Amount Input */}
      <Field>
        <FieldLabel>Amount</FieldLabel>
        <FieldContent>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="glass border-white/10 text-white bg-white/[0.02] text-lg font-light pr-16 placeholder:text-white/30"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-white/40 pointer-events-none">
              {selectedCurrency}
            </div>
          </div>
          <FieldDescription>
            Max: <button type="button" onClick={() => setAmount(maxAmount)} className="text-white/60 hover:text-white/90 transition-colors">{maxAmount} {selectedCurrency}</button>
          </FieldDescription>
        </FieldContent>
      </Field>

      {/* Quick Amount Buttons */}
      <div className="flex gap-2">
        {[0.25, 0.5, 0.75, 1].map((percent) => (
          <Button
            key={percent}
            variant="outline"
            size="sm"
            onClick={() => handleQuickAmount(percent)}
            className="flex-1 glass border-white/10 text-white/80 hover:bg-white/[0.05]"
          >
            {percent === 1 ? 'Max' : `${percent * 100}%`}
          </Button>
        ))}
      </div>

      {/* Note (Optional) */}
      <Field>
        <FieldLabel>Note (optional)</FieldLabel>
        <FieldContent>
          <Input
            placeholder="What's this for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="glass border-white/10 text-white bg-white/[0.02] placeholder:text-white/30"
          />
        </FieldContent>
      </Field>

      {/* Payment Method */}
      {cards.length > 0 && (
        <Field>
          <FieldLabel>Payment Method</FieldLabel>
          <FieldContent>
            <select
              name="card"
              value={selectedCard}
              onChange={(e) => setSelectedCard(e.target.value)}
              className="w-full h-7 rounded-md border border-white/10 bg-white/2 px-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
            >
              {cards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.name} •••• {card.last4}
                </option>
              ))}
            </select>
          </FieldContent>
        </Field>
      )}

      {/* Fee Display */}
      <div className="flex items-center justify-between py-2 px-3 rounded-lg glass-card border-white/5">
        <span className="text-xs text-white/60">Transaction fee</span>
        <Badge variant="outline" className="glass border-white/10 text-white/80">
          Free
        </Badge>
      </div>

      {/* Error Display */}
      {error && <FieldError>{error}</FieldError>}

      {/* Send Button */}
      <Button
        onClick={handleSend}
        disabled={!isValid || isSending}
        className="w-full h-10 text-sm bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md transition-all duration-300"
      >
        {isSending ? 'Sending...' : `Send ${amount ? `${amount} ${selectedCurrency}` : 'Money'}`}
      </Button>
    </div>
  );
}
