// Constants
export const APP_NAME = 'VEO' as const;
export const DEMO_CREDENTIALS = {
  email: 'demo@veo.com',
  password: 'demo123',
} as const;

// Card brands
export const CARD_BRANDS = [
  { value: 'visa', label: 'Visa', color: 'text-purple-400/90' },
  { value: 'mastercard', label: 'Mastercard', color: 'text-orange-400/90' },
  { value: 'amex', label: 'American Express', color: 'text-blue-400/90' },
] as const;

// Currencies
export const SUPPORTED_CURRENCIES = [
  { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
  { value: 'EUR', label: 'EUR - Euro', symbol: '€' },
  { value: 'GBP', label: 'GBP - British Pound', symbol: '£' },
  { value: 'BTC', label: 'BTC - Bitcoin', symbol: '₿' },
] as const;

// Modal titles mapping
export const MODAL_TITLES = {
  send: 'Send Money',
  receive: 'Receive Money',
  cards: 'Cards',
  holdings: 'Holdings',
  settings: 'Settings',
} as const;

// Animation durations
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 1000,
} as const;
