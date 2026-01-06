import { useCallback } from 'react';
import { useAppStore } from '@/store';
import type { Card } from '@/types';

interface AddCardParams {
  name: string;
  number: string;
  expiry: string;
  brand: Card['brand'];
}

export function useCards() {
  const { cards, setCards, isLoadingCards } = useAppStore();

  const addCard = useCallback((params: AddCardParams) => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      name: params.name,
      number: params.number,
      last4: params.number.slice(-4),
      expiry: params.expiry,
      brand: params.brand,
      balance: 0,
    };

    setCards([...cards, newCard]);
  }, [cards, setCards]);

  const deleteCard = useCallback((cardId: string) => {
    setCards(cards.filter((c) => c.id !== cardId));
  }, [cards, setCards]);

  const updateCardBalance = useCallback((cardId: string, balance: number) => {
    setCards(
      cards.map((c) => (c.id === cardId ? { ...c, balance } : c))
    );
  }, [cards, setCards]);

  return {
    cards,
    isLoading: isLoadingCards,
    addCard,
    deleteCard,
    updateCardBalance,
  };
}
