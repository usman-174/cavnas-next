"use client";

import { useState, useCallback } from 'react';
import { CreditCard, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCards } from '../hooks/useCards';
import { CardItem } from './CardItem';
import { AddCardForm } from './AddCardForm';

export function CardsList() {
  const { cards, isLoading } = useCards();
  const [showBalances, setShowBalances] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggleBalances = useCallback(() => {
    setShowBalances(prev => !prev);
  }, []);

  const handleToggleAddForm = useCallback(() => {
    setShowAddForm(prev => !prev);
  }, []);

  const handleShowAddForm = useCallback(() => {
    setShowAddForm(true);
  }, []);

  const handleHideAddForm = useCallback(() => {
    setShowAddForm(false);
  }, []);

  if (isLoading) {
    return <CardsListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="size-4 text-white/60" />
          <span className="text-sm text-white/60">
            {cards.length} {cards.length === 1 ? 'card' : 'cards'}
          </span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleToggleBalances}
            className="glass hover:bg-white/10 text-white/60"
          >
            {showBalances ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleAddForm}
            className="glass border-white/10 text-white/80 hover:bg-white/5"
          >
            Add Card
          </Button>
        </div>
      </div>

      {/* Add Card Form */}
      {showAddForm && (
        <AddCardForm
          onCancel={handleHideAddForm}
          onSuccess={handleHideAddForm}
        />
      )}

      {/* Cards List */}
      <div className="space-y-3">
        {cards.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <div className="flex justify-center">
              <div className="size-12 rounded-full bg-white/5 flex items-center justify-center">
                <CreditCard className="size-6 text-white/30" />
              </div>
            </div>
            <p className="text-sm text-white/60">No cards added yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowAddForm}
              className="glass border-white/10 text-white/80"
            >
              Add Your First Card
            </Button>
          </div>
        ) : (
          cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              showBalances={showBalances}
            />
          ))
        )}
      </div>

      {/* Security Note */}
      <div className="p-3 rounded-lg glass-card border-white/5">
        <p className="text-xs text-white/40">
          Your card information is encrypted and stored securely. We never store your CVV.
        </p>
      </div>
    </div>
  );
}

function CardsListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="h-40 rounded-xl glass-card border-white/10 bg-white/[0.02] animate-pulse"
        />
      ))}
    </div>
  );
}
