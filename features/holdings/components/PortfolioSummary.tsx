"use client";

import { TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercent } from '@/lib';

interface PortfolioSummaryProps {
  totalValue: number;
  totalChange24h: number;
  holdingsCount: number;
}

export function PortfolioSummary({ totalValue, totalChange24h, holdingsCount }: PortfolioSummaryProps) {
  return (
    <div className="p-4 rounded-xl glass-card border-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60">Total Portfolio Value</span>
        <Badge variant="outline" className="glass border-white/10 text-white/80">
          {holdingsCount} assets
        </Badge>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-light text-white/90 tracking-tight">
          {formatCurrency(totalValue)}
        </span>
        <div className={`flex items-center gap-1 text-sm ${totalChange24h >= 0 ? 'text-emerald-400/90' : 'text-red-400/90'}`}>
          <TrendingUp className="size-4" />
          <span>{formatPercent(totalChange24h * 100)}</span>
        </div>
      </div>
    </div>
  );
}
