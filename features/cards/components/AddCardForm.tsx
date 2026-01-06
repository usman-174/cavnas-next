"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldContent,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useCards } from '../hooks/useCards';
import { CARD_BRANDS, isValidCardNumber, isValidExpiry, isValidCVV } from '@/lib';

interface AddCardFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export function AddCardForm({ onCancel, onSuccess }: AddCardFormProps) {
  const { addCard } = useCards();
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
    brand: 'visa' as const,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    // Validate
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Cardholder name is required';
    if (!formData.number.trim()) {
      newErrors.number = 'Card number is required';
    } else if (!isValidCardNumber(formData.number)) {
      newErrors.number = 'Invalid card number';
    }
    if (!isValidExpiry(formData.expiry).isValid) {
      newErrors.expiry = isValidExpiry(formData.expiry).errors[0];
    }
    if (!isValidCVV(formData.cvv)) {
      newErrors.cvv = 'Invalid CVV (3-4 digits)';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Add card
    addCard({
      name: formData.name,
      number: formData.number,
      expiry: formData.expiry,
      brand: formData.brand,
    });

    onSuccess();
  };

  return (
    <div className="p-4 rounded-xl glass-card border-white/10 space-y-4">
      <h3 className="text-sm font-medium text-white/90">Add New Card</h3>

      <FieldGroup>
        <Field>
          <FieldLabel>Cardholder Name</FieldLabel>
          <FieldContent>
            <Input
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="glass border-white/10 text-white bg-white/2 placeholder:text-white/30"
            />
            <FieldError errors={[{ message: errors.name }]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Card Number</FieldLabel>
          <FieldContent>
            <Input
              placeholder="1234 5678 9012 3456"
              value={formData.number}
              onChange={(e) => {
                const value = e.target.value.replace(/\s/g, '').slice(0, 16);
                setFormData({ ...formData, number: value });
              }}
              className="glass border-white/10 text-white bg-white/2 placeholder:text-white/30 font-mono"
            />
            <FieldError errors={[{ message: errors.number }]} />
          </FieldContent>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Expiry Date</FieldLabel>
            <FieldContent>
              <Input
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                  }
                  setFormData({ ...formData, expiry: value });
                }}
                className="glass border-white/10 text-white bg-white/2 placeholder:text-white/30"
              />
              <FieldError errors={[{ message: errors.expiry }]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>CVV</FieldLabel>
            <FieldContent>
              <Input
                type="password"
                placeholder="•••"
                value={formData.cvv}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                className="glass border-white/10 text-white bg-white/2 placeholder:text-white/30"
              />
              <FieldError errors={[{ message: errors.cvv }]} />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel>Card Brand</FieldLabel>
          <FieldContent>
            <select
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value as any })}
              className="w-full h-7 rounded-md border border-white/10 bg-white/2 px-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
            >
              {CARD_BRANDS.map((brand) => (
                <option key={brand.value} value={brand.value}>
                  {brand.label}
                </option>
              ))}
            </select>
          </FieldContent>
        </Field>
      </FieldGroup>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            onCancel();
            setErrors({});
          }}
          className="flex-1 glass border-white/10 text-white/80"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          Add Card
        </Button>
      </div>
    </div>
  );
}
