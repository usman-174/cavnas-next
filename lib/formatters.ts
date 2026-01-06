// Formatters for currency, dates, and numbers

/**
 * Format currency amount with proper locale and precision
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'BTC' ? 'USD' : currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: currency === 'BTC' ? 8 : 2,
  }).format(amount);
}

/**
 * Format number with locale
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('en-US').format(amount);
}

/**
 * Format percentage change
 */
export function formatPercent(value: number, decimals: number = 2): string {
  const formatted = Math.abs(value).toFixed(decimals);
  return value >= 0 ? `+${formatted}%` : `-${formatted}%`;
}

/**
 * Format date relative to now
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format card number for display with spaces (e.g., "1234 5678 9012 3456")
 */
export function formatCardNumber(number: string): string {
  return number.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/**
 * Mask card number for display (e.g., "•••• •••• 1234")
 */
export function maskCardNumber(number: string, last4?: string): string {
  const digits = last4 || number.slice(-4);
  return `•••• •••• ${digits}`;
}

/**
 * Format large numbers with suffixes (K, M, B)
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
  return `$${num.toFixed(2)}`;
}
