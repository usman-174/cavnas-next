"use client";

import { useState } from 'react';
import { TierType, UserStatus, CabUser } from '@/types';

interface ManageUserModalProps {
  open: boolean;
  user: CabUser;
  updating: boolean;
  onClose: () => void;
  onUpdateUser: (userId: string, updates: { tier?: TierType; status?: UserStatus }) => Promise<void>;
  getTierBadge: (tier: TierType) => React.ReactNode;
  getStatusBadge: (status: UserStatus) => React.ReactNode;
}

export function ManageUserModal({
  open,
  user,
  updating,
  onClose,
  onUpdateUser,
  getTierBadge,
  getStatusBadge,
}: ManageUserModalProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);

  if (!open) return null;

  const handleUpdate = async (label: string, updates: { tier?: TierType; status?: UserStatus }) => {
    if (updating) return;
    setActiveAction(label);
    try {
      await onUpdateUser(user.id, updates);
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-6">Manage User</h3>

        <div className="space-y-6 mb-6">
          {/* User Info */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-sm font-medium text-white">{user.name}</div>
            <div className="text-xs text-white/40">{user.email}</div>
            <div className="flex items-center gap-2 mt-2">
              {getTierBadge(user.tier)}
              {getStatusBadge(user.status)}
            </div>
          </div>

          {/* Status Update */}
          <div>
            <label className="text-xs font-medium text-white/40 mb-3 block uppercase tracking-wider">Update Status</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(UserStatus).map((status) => {
                const isActive = activeAction === `status-${status}`;
                return (
                  <button
                    key={status}
                    onClick={() => handleUpdate(`status-${status}`, { status })}
                    disabled={updating}
                    className={`px-3 py-2.5 rounded-lg text-xs font-medium capitalize transition-all ${user.status === status
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                      } ${updating ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {isActive && updating ? 'Updating...' : status.toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tier Update */}
          <div>
            <label className="text-xs font-medium text-white/40 mb-3 block uppercase tracking-wider">Update Tier</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(TierType).map((tier) => {
                const isActive = activeAction === `tier-${tier}`;
                return (
                  <button
                    key={tier}
                    onClick={() => handleUpdate(`tier-${tier}`, { tier })}
                    disabled={updating}
                    className={`px-3 py-2.5 rounded-lg text-xs font-medium capitalize transition-all ${user.tier === tier
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                      } ${updating ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {isActive && updating ? 'Updating...' : tier === 'EARLY_BIRD' ? 'Early Bird' : 'Regular'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={updating}
            className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-white/80 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
