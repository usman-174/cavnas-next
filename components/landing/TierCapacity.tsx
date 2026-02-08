"use client";

import { useEffect, useState } from 'react';
import { TierCapacityInfo, TierType } from '@/types';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glassmorphic/GlassCard';
import { Users, TrendingUp } from 'lucide-react';

/**
 * TierCapacity Component
 *
 * Displays real-time tier capacity information with auto-refresh every 30 seconds.
 * Accepts initial data from server-side rendering for instant display and SEO.
 *
 * @param initialData - Server-fetched tier capacity data for SSR
 */
interface TierCapacityProps {
  initialData?: TierCapacityInfo[];
}

// Helper function to fetch tier capacity from API (for client-side refresh)
async function fetchTierCapacity(): Promise<TierCapacityInfo[]> {
  try {
    const response = await fetch('/api/tiers/capacity', {
      cache: 'no-store', // Always get fresh data
    });
    const result = await response.json();
    if (result.success) {
      return result.data || [];
    }
    return [];
  } catch {
    return [];
  }
}

// Format tier name for display
function formatTierName(tier: TierType): string {
  return tier === TierType.EARLY_BIRD ? 'Early Bird' : 'Regular';
}

// Get tier color classes
function getTierColor(tier: TierType): {
  bg: string;
  border: string;
  text: string;
  progress: string;
} {
  return tier === TierType.EARLY_BIRD
    ? {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        progress: 'bg-emerald-500/50',
      }
    : {
        bg: 'bg-white/5',
        border: 'border-white/20',
        text: 'text-white/70',
        progress: 'bg-white/30',
      };
}

export function TierCapacity({ initialData = [] }: TierCapacityProps) {
  const [capacities, setCapacities] = useState<TierCapacityInfo[]>(initialData);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Client-side refresh every 30 seconds (keeps the "live" feeling)
  useEffect(() => {
    // Skip if no initial data was provided (shouldn't happen with SSR)
    if (initialData.length === 0) return;

    const loadCapacities = async () => {
      const data = await fetchTierCapacity();
      if (data.length > 0) {
        setCapacities(data);
        setLastUpdate(new Date());
      }
    };

    // Set up interval for live updates
    const interval = setInterval(loadCapacities, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [initialData.length]);

  // Don't render if we have no data at all
  if (capacities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-white/60">Live Capacity</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-light text-white/90 mb-4">
          Reservation Status
        </h2>
        <p className="text-white/50 max-w-xl mx-auto">
          Secure your position in the CAB2Wealth co-investment program. Limited spots available per tier.
        </p>
      </motion.div>

      {/* Tier Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {capacities.map((tierInfo, index) => {
          const colors = getTierColor(tierInfo.tier);
          const tierName = formatTierName(tierInfo.tier);

          return (
            <motion.div
              key={tierInfo.tier}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                variant="default"
                className={`p-8 border ${colors.border}`}
              >
                {/* Tier Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center`}>
                      <Users size={24} className={colors.text} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white/90">{tierName}</h3>
                      <p className="text-sm text-white/40">
                        {tierInfo.capacity.toLocaleString()} Total Capacity
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${colors.bg} border ${colors.border}`}>
                    <span className={`text-xs font-medium ${colors.text}`}>
                      {tierInfo.progressPercent}%
                    </span>
                  </div>
                </div>

                {/* Progress Display */}
                <div className="mb-4">
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <div className="text-3xl md:text-4xl font-light text-white/90">
                        {tierInfo.currentCount.toLocaleString()}
                      </div>
                      <div className="text-sm text-white/40">
                        Reserved
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-light ${colors.text}`}>
                        {tierInfo.remaining.toLocaleString()}
                      </div>
                      <div className="text-sm text-white/40">
                        Remaining
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${tierInfo.progressPercent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${colors.progress}`}
                    />
                  </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                  <TrendingUp size={16} className="text-white/40" />
                  <span className="text-xs text-white/40">
                    {tierInfo.remaining > 0
                      ? `${tierInfo.remaining} spots still available`
                      : 'Tier at full capacity'}
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
