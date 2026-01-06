import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hover' | 'strong';
  onClick?: () => void;
}

export function GlassCard({ children, className, variant = 'default', onClick }: GlassCardProps) {
  const variants = {
    default: 'bg-white/[0.02] border-white/5',
    hover: 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/10',
    strong: 'bg-white/10 border-white/20',
  };

  return (
    <div
      className={cn(
        'rounded-2xl backdrop-blur-md transition-all duration-500',
        variants[variant],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
