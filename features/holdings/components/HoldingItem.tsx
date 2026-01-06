"use client";

import { memo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercent, formatLargeNumber } from '@/lib';
import type { Holding } from '@/types';

interface HoldingItemProps {
  holding: Holding;
}

export const HoldingItem = memo(function HoldingItem({ holding }: HoldingItemProps) {
  const value = holding.quantity * holding.currentPrice;
  const isPositive = holding.change24h >= 0;

  return (
    <Card className="glass-card border-white/10 bg-white/2 hover:border-white/20 transition-all duration-300 hover:bg-white/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Asset Icon */}
            <div className={`size-10 rounded-full bg-gradient-to-br ${
              isPositive ? 'from-emerald-500/20 to-teal-500/10' : 'from-red-500/20 to-orange-500/10'
            } flex items-center justify-center`}>
              <span className="text-sm font-medium text-white/80">
                {holding.symbol.slice(0, 2)}
              </span>
            </div>

            <div>
              <div className="text-sm font-medium text-white/90">{holding.name}</div>
              <div className="text-xs text-white/40">{holding.quantity} {holding.symbol}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-white/90">
              {formatCurrency(value)}
            </div>
            <div className={`flex items-center justify-end gap-1 text-xs ${isPositive ? 'text-emerald-400/90' : 'text-red-400/90'}`}>
              {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              <span>{formatPercent(holding.change24h)}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div>
            <div className="text-white/40 mb-1">Price</div>
            <div className="text-white/70">
              {formatCurrency(holding.currentPrice)}
            </div>
          </div>
          <div>
            <div className="text-white/40 mb-1">24h Volume</div>
            <div className="text-white/70">
              {formatLargeNumber(holding.volume24h)}
            </div>
          </div>
          <div>
            <div className="text-white/40 mb-1">Market Cap</div>
            <div className="text-white/70">
              {formatLargeNumber(holding.marketCap)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
