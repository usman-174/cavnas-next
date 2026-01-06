"use client";

import { useState, useCallback, useMemo } from 'react';
import { Copy, Check, ArrowDownLeft, Share2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store';

const WALLET_ADDRESSES: Record<string, string> = {
  USD: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  EUR: '0x3E5d9C5312c40A4a0C5f4B3F3F3F3F3F3F3F3F3F',
  GBP: '0x8b3D99F2B6f6C7f7e3f3F3F3F3F3F3F3F3F3F3F3F',
  BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
};

export function ReceivePanel() {
  const { balance } = useAppStore();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState('');

  const walletAddress = useMemo(
    () => WALLET_ADDRESSES[selectedCurrency] || '',
    [selectedCurrency]
  );

  const availableBalance = useMemo(() => {
    const currencyBalance = balance?.[selectedCurrency];
    if (currencyBalance && typeof currencyBalance === 'object' && 'available' in currencyBalance) {
      return currencyBalance.available;
    }
    return 0;
  }, [balance, selectedCurrency]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [walletAddress]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Receive Payment',
          text: `Send ${selectedCurrency} to: ${walletAddress}`,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopy();
    }
  }, [selectedCurrency, walletAddress, handleCopy]);

  const paymentLink = useMemo(() => {
    if (!amount) return walletAddress;
    return `${walletAddress}?amount=${amount}`;
  }, [amount, walletAddress]);

  const handleCopyPaymentLink = useCallback(() => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [paymentLink]);

  const networkName = useMemo(() => {
    return selectedCurrency === 'BTC' ? 'Bitcoin Network' : 'Ethereum Network';
  }, [selectedCurrency]);

  return (
    <div className="space-y-6">
      {/* Currency Selector */}
      <Field>
        <FieldLabel>Select Currency</FieldLabel>
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
            Current balance: <span className="text-white/60">{availableBalance.toLocaleString()} {selectedCurrency}</span>
          </FieldDescription>
        </FieldContent>
      </Field>

      {/* Optional Amount */}
      <Field>
        <FieldLabel>Request Specific Amount (Optional)</FieldLabel>
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
            Leave empty to receive any amount
          </FieldDescription>
        </FieldContent>
      </Field>

      {/* QR Code Placeholder */}
      <div className="flex justify-center py-4">
        <div className="relative group">
          <div className="size-48 rounded-2xl glass-card border-white/10 flex items-center justify-center bg-white/[0.02] overflow-hidden">
            {/* QR Code placeholder - in production use a real QR library */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="size-16 rounded-lg bg-white/10 flex items-center justify-center">
                  <QrCode className="size-8 text-white/40" />
                </div>
              </div>
              <p className="text-xs text-white/40 max-w-[160px]">
                Scan QR code to receive payment
              </p>
            </div>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Badge variant="outline" className="glass border-white/20 text-white/90">
              Show QR
            </Badge>
          </div>
        </div>
      </div>

      {/* Wallet Address Display */}
      <Field>
        <FieldLabel>Your Wallet Address</FieldLabel>
        <FieldContent>
          <div className="relative group">
            <div className="p-3 rounded-lg glass-card border-white/10 bg-white/[0.02] font-mono text-xs text-white/80 break-all pr-20">
              {walletAddress}
            </div>
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleCopy}
                className="glass hover:bg-white/10 text-white/60 hover:text-white/90"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleShare}
                className="glass hover:bg-white/10 text-white/60 hover:text-white/90"
              >
                <Share2 className="size-3.5" />
              </Button>
            </div>
          </div>
          {copied && (
            <FieldDescription className="text-emerald-400/90">Address copied to clipboard!</FieldDescription>
          )}
        </FieldContent>
      </Field>

      {/* Payment Link */}
      {amount && (
        <Field>
          <FieldLabel>Payment Link</FieldLabel>
          <FieldContent>
            <div className="relative group">
              <div className="p-3 rounded-lg glass-card border-white/10 bg-white/[0.02] font-mono text-xs text-white/80 break-all pr-10">
                {paymentLink}
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleCopyPaymentLink}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 glass hover:bg-white/10 text-white/60 hover:text-white/90"
              >
                <Copy className="size-3.5" />
              </Button>
            </div>
            <FieldDescription>
              Share this link to request {amount} {selectedCurrency}
            </FieldDescription>
          </FieldContent>
        </Field>
      )}

      {/* Info Box */}
      <div className="p-3 rounded-lg glass-card border-white/5 space-y-2">
        <div className="flex items-start gap-2">
          <ArrowDownLeft className="size-4 text-emerald-400/90 shrink-0 mt-0.5" />
          <div className="text-xs text-white/60">
            <p className="font-medium text-white/80 mb-1">How to receive</p>
            <ul className="space-y-1">
              <li>• Share your wallet address or QR code</li>
              <li>• Use the payment link for specific requests</li>
              <li>• Funds will appear in your balance automatically</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Network Info */}
      <div className="flex items-center justify-center gap-2">
        <div className="size-1.5 rounded-full bg-emerald-400/90 animate-pulse" />
        <span className="text-xs text-white/40">
          {networkName} • Active
        </span>
      </div>
    </div>
  );
}
