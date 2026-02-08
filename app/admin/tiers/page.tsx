"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { TierType, TierCapacityInfo } from '@/types';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSkeleton } from '@/components/admin/admin-skeleton';
import { Users, Edit, RefreshCw, TrendingUp, Loader2 } from 'lucide-react';

// API helper for admin requests
async function adminFetch<T>(endpoint: string, options?: RequestInit): Promise<{ success: boolean; data?: T; error?: string }> {
  const { user } = useAuthStore.getState();

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.id || ''}`,
        ...options?.headers,
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

interface TierManagementData extends TierCapacityInfo {
  actualUserCount: number;
}

function TierManagementContent() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuthStore();

  const [tiers, setTiers] = useState<TierManagementData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingTier, setEditingTier] = useState<TierType | null>(null);
  const [newCapacity, setNewCapacity] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !isAdmin()) {
      router.push('/dashboard');
      return;
    }
    loadTiers();
  }, [user, isAdmin]);

  const loadTiers = async () => {
    setIsLoading(true);
    setError(null);
    const response = await adminFetch<TierManagementData[]>('/api/admin/tiers');
    if (response.success && response.data) {
      setTiers(response.data);
    } else {
      setError(response.error || 'Failed to load tier data');
    }
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const response = await adminFetch<TierManagementData[]>('/api/admin/tiers');
    if (response.success && response.data) {
      setTiers(response.data);
    }
    setIsRefreshing(false);
  };

  const handleEdit = (tier: TierType, currentCapacity: number) => {
    setEditingTier(tier);
    setNewCapacity(currentCapacity.toString());
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingTier(null);
    setNewCapacity('');
    setError(null);
  };

  const handleSaveCapacity = async () => {
    if (!editingTier) return;

    const capacity = parseInt(newCapacity);
    if (isNaN(capacity) || capacity < 0) {
      setError('Capacity must be a positive number');
      return;
    }

    const tierData = tiers.find(t => t.tier === editingTier);
    if (tierData && capacity < tierData.actualUserCount) {
      setError(`Capacity cannot be less than current user count (${tierData.actualUserCount})`);
      return;
    }

    setIsSaving(true);
    setError(null);

    const response = await adminFetch<TierCapacityInfo>(
      `/api/admin/tiers/${editingTier}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ capacity }),
      }
    );

    if (response.success && response.data) {
      // Update local state with response
      setTiers(prev =>
        prev.map(t =>
          t.tier === editingTier
            ? { ...t, ...response.data!, actualUserCount: t.actualUserCount }
            : t
        )
      );
      setEditingTier(null);
      setNewCapacity('');
    } else {
      setError(response.error || 'Failed to update capacity');
    }

    setIsSaving(false);
  };

  const formatTierName = (tier: TierType): string => {
    return tier === TierType.EARLY_BIRD ? 'Early Bird' : 'Regular';
  };

  const getTierColor = (tier: TierType) => {
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
  };

  if (isLoading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader user={user} onLogout={logout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-light text-white/90">Tier Management</h2>
              <p className="text-sm text-white/40 mt-1">
                View and manage capacity limits for each tier
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm disabled:opacity-50"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Tier Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {tiers.map((tierInfo) => {
              const colors = getTierColor(tierInfo.tier);
              const isEditing = editingTier === tierInfo.tier;
              const tierName = formatTierName(tierInfo.tier);

              return (
                <div
                  key={tierInfo.tier}
                  className={`p-6 rounded-xl border ${colors.border} bg-gradient-to-br from-white/[0.02] to-transparent`}
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

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {/* Capacity (Editable) */}
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-white/40 mb-1">Capacity</div>
                      {isEditing ? (
                        <input
                          type="number"
                          value={newCapacity}
                          onChange={(e) => setNewCapacity(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-lg focus:outline-none focus:border-white/20"
                          autoFocus
                        />
                      ) : (
                        <div className="text-2xl font-light text-white/90">
                          {tierInfo.capacity.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Reserved (Read-only) */}
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-white/40 mb-1">Reserved</div>
                      <div className="text-2xl font-light text-white/90">
                        {tierInfo.currentCount.toLocaleString()}
                      </div>
                    </div>

                    {/* Remaining (Calculated) */}
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-white/40 mb-1">Remaining</div>
                      <div className={`text-2xl font-light ${colors.text}`}>
                        {tierInfo.remaining.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div
                        className={`h-full ${colors.progress} transition-all duration-500`}
                        style={{ width: `${tierInfo.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <TrendingUp size={14} />
                      <span>
                        {tierInfo.actualUserCount} actual users in database
                      </span>
                    </div>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveCapacity}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-all text-sm font-medium disabled:opacity-50"
                        >
                          {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(tierInfo.tier, tierInfo.capacity)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
                      >
                        <Edit size={16} />
                        Edit Capacity
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {tiers.length === 0 && (
            <div className="text-center py-16">
              <Users size={48} className="mx-auto text-white/10 mb-4" />
              <p className="text-white/40 text-sm">No tier capacities found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function TierManagementPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <TierManagementContent />
    </Suspense>
  );
}
