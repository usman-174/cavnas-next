"use client";

import { useState, useCallback } from 'react';
import { memo } from 'react';
import { CreditCard, Copy, Check, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { useCards } from '../hooks/useCards';
import { CARD_BRANDS, formatCardNumber } from '@/lib';
import type { Card as CardType } from '@/types';

interface CardItemProps {
  card: CardType;
  showBalances?: boolean;
}

export const CardItem = memo(function CardItem({ card, showBalances = true }: CardItemProps) {
  const { deleteCard } = useCards();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(card.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [card.number]);

  const handleDelete = useCallback(() => {
    if (confirm('Remove this card?')) {
      deleteCard(card.id);
    }
  }, [card.id, deleteCard]);

  const getCardGradient = (brand: string) => {
    const gradients = {
      visa: 'from-purple-500/20 via-violet-500/10 to-purple-600/20',
      mastercard: 'from-orange-500/20 via-amber-500/10 to-orange-600/20',
      amex: 'from-blue-500/20 via-cyan-500/10 to-blue-600/20',
    };
    return gradients[brand as keyof typeof gradients] || gradients.visa;
  };

  const brandInfo = CARD_BRANDS.find(b => b.value === card.brand);

  return (
    <Card
      className={`glass-card border-white/10 bg-gradient-to-br ${getCardGradient(card.brand)} overflow-hidden group transition-all duration-300 hover:border-white/20`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className={`size-4 ${brandInfo?.color}`} />
            <span className="text-sm font-medium text-white/90">
              {brandInfo?.label}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="glass hover:bg-white/10 text-white/40 hover:text-white/60">
              <Button variant="ghost" size="icon-sm" className="p-0">
                <MoreVertical className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-strong border-white/10 text-white bg-black/90">
              <DropdownMenuItem
                onClick={handleCopy}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <Copy className="size-3.5 mr-2" />
                {copied ? 'Copied!' : 'Copy Number'}
                {copied && <Check className="size-3.5 ml-auto text-emerald-400/90" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Remove Card
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-xs text-white/40 mb-1">Card Number</div>
            <div className="font-mono text-sm text-white/80 flex items-center gap-2">
              {showBalances ? formatCardNumber(card.number) : `•••• •••• •••• ${card.last4}`}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-white/40 mb-1">Expires</div>
              <div className="text-sm text-white/80">{card.expiry}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/40 mb-1">Balance</div>
              <div className="text-sm text-white/80">
                {showBalances ? `$${card.balance.toLocaleString()}` : '••••••'}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-white/40 mb-1">Cardholder</div>
            <div className="text-sm text-white/80">{card.name}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
