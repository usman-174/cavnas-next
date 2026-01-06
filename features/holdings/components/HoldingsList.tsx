"use client";

import { useMemo, useState, useCallback } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Search, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useHoldings } from '../hooks/useHoldings';
import { HoldingItem } from './HoldingItem';
import { PortfolioSummary } from './PortfolioSummary';

type SortOption = 'value' | 'change' | 'name' | 'quantity';
type FilterOption = 'all' | 'gainers' | 'losers';

export function HoldingsList() {
  const { holdings, isLoading } = useHoldings();
  const [sortBy, setSortBy] = useState<SortOption>('value');
  const [filter, setFilter] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedHoldings = useMemo(() => {
    let result = holdings.filter((h) => {
      const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           h.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === 'all' ||
        (filter === 'gainers' && h.change24h >= 0) ||
        (filter === 'losers' && h.change24h < 0);
      return matchesSearch && matchesFilter;
    });

    return result.sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return (b.quantity * b.currentPrice) - (a.quantity * a.currentPrice);
        case 'change':
          return b.change24h - a.change24h;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'quantity':
          return b.quantity - a.quantity;
        default:
          return 0;
      }
    });
  }, [holdings, searchQuery, filter, sortBy]);

  const totalValue = useMemo(() =>
    holdings.reduce((sum, h) => sum + (h.quantity * h.currentPrice), 0),
    [holdings]
  );

  const totalChange24h = useMemo(() =>
    holdings.length > 0
      ? holdings.reduce((sum, h) => sum + (h.change24h * h.quantity * h.currentPrice), 0) / totalValue
      : 0,
    [holdings, totalValue]
  );

  const handleSort = useCallback((option: SortOption) => {
    setSortBy(option);
  }, []);

  const handleFilter = useCallback((option: FilterOption) => {
    setFilter(option);
  }, []);

  if (isLoading) {
    return <HoldingsListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <PortfolioSummary
        totalValue={totalValue}
        totalChange24h={totalChange24h}
        holdingsCount={holdings.length}
      />

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-white/40" />
          <Input
            placeholder="Search holdings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass border-white/10 text-white bg-white/2 pl-8 placeholder:text-white/30"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="icon-sm" className="glass border-white/10 text-white/60 p-0">
                <Filter className="size-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent className="border-0 text-white bg-black/95">
            <DropdownMenuItem
              onClick={() => handleFilter('all')}
              className={`${filter === 'all' ? 'bg-white/10' : ''} hover:bg-white/10 cursor-pointer`}
            >
              All Assets
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilter('gainers')}
              className={`${filter === 'gainers' ? 'bg-white/10' : ''} hover:bg-white/10 cursor-pointer`}
            >
              <TrendingUp className="size-3.5 mr-2 text-emerald-400/90" />
              Gainers
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilter('losers')}
              className={`${filter === 'losers' ? 'bg-white/10' : ''} hover:bg-white/10 cursor-pointer`}
            >
              <TrendingDown className="size-3.5 mr-2 text-red-400/90" />
              Losers
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="icon-sm" className="glass border-white/10 text-white/60 p-0">
                <ArrowUpDown className="size-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent className="border-0 text-white bg-black/95">
            <DropdownMenuItem onClick={() => handleSort('value')} className={`${sortBy === 'value' ? 'bg-white/10' : ''} hover:bg-white/10 cursor-pointer`}>
              Sort by Value
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('change')} className={`${sortBy === 'change' ? 'bg-white/10' : ''} hover:bg-white/10 cursor-pointer`}>
              Sort by Change (24h)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('quantity')} className={`${sortBy === 'quantity' ? 'bg-white/10' : ''} hover:bg-white/10 cursor-pointer`}>
              Sort by Quantity
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('name')} className={`${sortBy === 'name' ? 'bg-white/10' : ''} hover:bg-white/10 cursor-pointer`}>
              Sort by Name
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Holdings List */}
      <div className="space-y-2">
        {filteredAndSortedHoldings.length === 0 ? (
          <Card className="glass-card border-white/10 bg-white/2">
            <CardContent className="pt-6">
              <div className="text-center py-8 space-y-3">
                <div className="flex justify-center">
                  <div className="size-12 rounded-full bg-white/5 flex items-center justify-center">
                    <DollarSign className="size-6 text-white/30" />
                  </div>
                </div>
                <p className="text-sm text-white/60">
                  {searchQuery ? 'No holdings found' : 'No holdings yet'}
                </p>
                <p className="text-xs text-white/40">
                  {searchQuery ? 'Try a different search term' : 'Start investing to see your holdings here'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedHoldings.map((holding) => (
            <HoldingItem key={holding.id} holding={holding} />
          ))
        )}
      </div>
    </div>
  );
}

function HoldingsListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-28 rounded-xl glass-card border-white/10 bg-white/2 animate-pulse"
        />
      ))}
    </div>
  );
}
