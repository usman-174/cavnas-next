import React from 'react';

interface CabLogoProps {
  variant?: 'default' | 'small' | 'large';
  showText?: boolean;
  className?: string;
}

/**
 * CAB Logo - Connoisseur Asset Builder
 *
 * A sophisticated glassmorphic logo featuring:
 * - Circular container with subtle border
 * - "CAB" monogram with premium typography
 * - Optional "CAB2Wealth" text display
 *
 * @example
 * <CabLogo /> // Default size with text
 * <CabLogo variant="small" showText={false} /> // Small icon only
 * <CabLogo variant="large" /> // Large hero logo
 */
export function CabLogo({
  variant = 'default',
  showText = true,
  className = '',
}: CabLogoProps) {
  const sizeClasses = {
    small: 'w-6 h-6 text-[8px]',
    default: 'w-8 h-8 text-[10px]',
    large: 'w-16 h-16 text-lg',
  };

  const textSizeClasses = {
    small: 'text-xs',
    default: 'text-sm',
    large: 'text-xl',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Badge */}
      <div
        className={`rounded-full border border-white/10 bg-white/5 flex items-center justify-center backdrop-blur-md ${sizeClasses[variant]}`}
      >
        <span
          className={`font-bold tracking-widest text-white/80 ${sizeClasses[variant]}`}
        >
          CAB
        </span>
      </div>

      {/* Optional Text */}
      {showText && (
        <span
          className={`font-medium text-white/90 ${textSizeClasses[variant]}`}
        >
          CAB2Wealth
        </span>
      )}
    </div>
  );
}

/**
 * Compact logo variant - badge only, no text
 * Useful for mobile navigation, headers, etc.
 */
export function CabLogoBadge({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-full border border-white/10 bg-white/5 flex items-center justify-center backdrop-blur-md w-8 h-8 ${className}`}
    >
      <span className="text-[10px] font-bold tracking-widest text-white/80">
        CAB
      </span>
    </div>
  );
}

/**
 * Full logo with tagline
 * Useful for hero sections, about pages, etc.
 */
export function CabLogoFull({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center backdrop-blur-md">
          <span className="text-sm font-bold tracking-widest text-white/80">
            CAB
          </span>
        </div>
        <span className="text-lg font-medium text-white/90">CAB2Wealth</span>
      </div>
      <span className="text-xs text-white/40 tracking-wide">
        Connoisseur Asset Builder
      </span>
    </div>
  );
}
