"use client";

import { useEffect, useState, useTransition, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { TierType, UserRole, UserStatus, CabUser } from '@/types';
import { Search, RefreshCw, Shield, Users, ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminSkeleton, TableSkeleton } from '@/components/admin/admin-skeleton';
import { AdminHeader } from '@/components/admin/admin-header';
import { ManageUserModal } from '@/components/admin/ManageUserModal';

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

interface AdminData {
  users: CabUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  summary: {
    total: number;
    earlyBirdCount: number;
    regularCount: number;
    pendingCount: number;
    activeCount: number;
  };
}

function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAdmin, logout } = useAuthStore();

  const [data, setData] = useState<AdminData | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [tierFilter, setTierFilter] = useState(searchParams.get('tier') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [perPage, setPerPage] = useState(parseInt(searchParams.get('limit') || '10'));
  const [selectedUser, setSelectedUser] = useState<CabUser | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Update URL params when filters change
  const updateParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value === 'all' || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    const queryString = newParams.toString();
    startTransition(() => {
      router.push(`/admin${queryString ? `?${queryString}` : ''}`, { scroll: false });
    });
  };

  useEffect(() => {
    // Check if user is admin
    if (user && !isAdmin()) {
      router.push('/dashboard');
      return;
    }

    loadAdminData(true);
  }, [user, isAdmin]);

  // Load data when filters change via URL params (not including search input)
  useEffect(() => {
    if (!initialLoading) {
      loadAdminData(false);
    }
  }, [statusFilter, tierFilter, searchQuery, sortBy, sortOrder, currentPage, perPage]);

  // Sync filters with URL params (but not search input - that's separate)
  useEffect(() => {
    const status = searchParams.get('status') || 'all';
    const tier = searchParams.get('tier') || 'all';
    const search = searchParams.get('search') || '';
    const sortByParam = searchParams.get('sortBy') || 'createdAt';
    const sortOrderParam = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    setStatusFilter(status);
    setTierFilter(tier);
    setSearchQuery(search);
    setSearchInput(search);
    setSortBy(sortByParam);
    setSortOrder(sortOrderParam);
    setCurrentPage(page);
    setPerPage(limit);
  }, [searchParams]);

  const loadAdminData = async (isInitial = false) => {
    if (isInitial) {
      setInitialLoading(true);
    } else {
      setIsRefreshing(true);
    }

    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.append('status', statusFilter);
    if (tierFilter !== 'all') params.append('tier', tierFilter);
    if (searchQuery) params.append('search', searchQuery);
    params.append('sortBy', sortBy);
    params.append('sortOrder', sortOrder);
    params.append('page', currentPage.toString());
    params.append('limit', perPage.toString());

    const response = await adminFetch<AdminData>(`/api/admin/users?${params.toString()}`);
    if (response.success && response.data) {
      setData(response.data);
    }

    setInitialLoading(false);
    setIsRefreshing(false);
  };

  const handleUpdateUser = async (userId: string, updates: { tier?: TierType; status?: UserStatus }) => {
    if (updating) return;
    setUpdating(true);
    const response = await adminFetch<CabUser>(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });

    if (response.success) {
      await loadAdminData(false);
      setShowUpdateModal(false);
      setSelectedUser(null);
    }
    setUpdating(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1); // Reset to first page on new search
    updateParams({ search: searchInput, status: statusFilter, tier: tierFilter, sortBy, sortOrder, page: '1', limit: perPage.toString() });
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
    updateParams({ search: '', status: statusFilter, tier: tierFilter, sortBy, sortOrder, page: '1', limit: perPage.toString() });
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
    updateParams({ search: searchQuery, status: value, tier: tierFilter, sortBy, sortOrder, page: '1', limit: perPage.toString() });
  };

  const handleTierFilterChange = (value: string) => {
    setTierFilter(value);
    setCurrentPage(1);
    updateParams({ search: searchQuery, status: statusFilter, tier: value, sortBy, sortOrder, page: '1', limit: perPage.toString() });
  };

  const handleSortBy = (column: string) => {
    let newOrder: 'asc' | 'desc' = 'desc';
    if (sortBy === column && sortOrder === 'desc') {
      newOrder = 'asc';
    }
    setSortBy(column);
    setSortOrder(newOrder);
    setCurrentPage(1);
    updateParams({ search: searchQuery, status: statusFilter, tier: tierFilter, sortBy: column, sortOrder: newOrder, page: '1', limit: perPage.toString() });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateParams({ search: searchQuery, status: statusFilter, tier: tierFilter, sortBy, sortOrder, page: newPage.toString(), limit: perPage.toString() });
  };

  const handlePerPageChange = (newLimit: number) => {
    setPerPage(newLimit);
    setCurrentPage(1); // Reset to first page when changing per page
    updateParams({ search: searchQuery, status: statusFilter, tier: tierFilter, sortBy, sortOrder, page: '1', limit: newLimit.toString() });
  };

  const filteredUsers = data?.users || [];

  // Sort indicator component
  const SortIndicator = ({ column }: { column: string }) => {
    if (sortBy !== column) {
      return <ChevronDown size={12} className="text-white/20 opacity-0 group-hover:opacity-50 transition-opacity" />;
    }
    return sortOrder === 'asc'
      ? <ChevronDown size={12} className="text-white rotate-180" />
      : <ChevronDown size={12} className="text-white" />;
  };

  const getTierBadge = (tier: TierType) => {
    switch (tier) {
      case TierType.EARLY_BIRD:
        return <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">Early Bird</span>;
      case TierType.REGULAR:
        return <span className="inline-flex items-center px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-white/60">Regular</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-white/40">Unknown</span>;
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">Active</span>;
      case UserStatus.PENDING:
        return <span className="inline-flex items-center px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-400">Pending</span>;
      case UserStatus.SUSPENDED:
        return <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400">Suspended</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-white/40">Unknown</span>;
    }
  };

  // Show full page skeleton on initial load
  if (initialLoading) {
    return <AdminSkeleton />;
  }

  // Show error state if data failed to load
  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-4">Failed to load admin data</p>
          <button
            onClick={() => loadAdminData(true)}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <div className="p-3 sm:p-5 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="p-1.5 sm:p-2 rounded-lg bg-white/5">
                  <Users size={14} className="sm:size-[18px] text-white/60" />
                </div>
                <span className="text-xs sm:text-sm text-white/40">Total Users</span>
              </div>
              <div className="text-2xl sm:text-3xl font-light text-white">{data.summary.total}</div>
            </div>

            <div className="p-3 sm:p-5 rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10">
                  <Shield size={14} className="sm:size-[18px] text-emerald-400" />
                </div>
                <span className="text-xs sm:text-sm text-white/40">Early Bird</span>
              </div>
              <div className="text-2xl sm:text-3xl font-light text-emerald-400">{data.summary.earlyBirdCount}</div>
            </div>

            <div className="p-3 sm:p-5 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="p-1.5 sm:p-2 rounded-lg bg-white/5">
                  <Users size={14} className="sm:size-[18px] text-white/60" />
                </div>
                <span className="text-xs sm:text-sm text-white/40">Regular</span>
              </div>
              <div className="text-2xl sm:text-3xl font-light text-white/70">{data.summary.regularCount}</div>
            </div>

            <div className="p-3 sm:p-5 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/10">
                  <RefreshCw size={14} className="sm:size-[18px] text-amber-400" />
                </div>
                <span className="text-xs sm:text-sm text-white/40">Pending</span>
              </div>
              <div className="text-2xl sm:text-3xl font-light text-amber-400">{data.summary.pendingCount}</div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                className="w-full pl-11 pr-24 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchInput && (
                  <button
                    onClick={handleClearSearch}
                    className="p-1.5 rounded-md text-white/40 hover:text-white/60 hover:bg-white/10 transition-all"
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  onClick={handleSearchSubmit}
                  className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all"
                >
                  Search
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger className="px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm hover:bg-white/10 transition-all flex items-center gap-2 min-w-[140px] justify-between">
                  <span>
                    {statusFilter === 'all' ? 'All Status' :
                      statusFilter === 'PENDING' ? 'Pending' :
                        statusFilter === 'ACTIVE' ? 'Active' : 'Suspended'}
                  </span>
                  <ChevronDown size={14} className="text-white/40" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border border-white/10 bg-[#0a0a0a] text-white min-w-[140px] z-50">
                  <DropdownMenuItem
                    onClick={() => handleStatusFilterChange('all')}
                    className="hover:bg-white/10 cursor-pointer text-sm"
                  >
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusFilterChange('PENDING')}
                    className="hover:bg-white/10 cursor-pointer text-sm font-medium text-amber-400"
                  >
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusFilterChange('ACTIVE')}
                    className="hover:bg-white/10 cursor-pointer text-sm font-medium text-emerald-400"
                  >
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusFilterChange('SUSPENDED')}
                    className="hover:bg-white/10 cursor-pointer text-sm font-medium text-red-400"
                  >
                    Suspended
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm hover:bg-white/10 transition-all flex items-center gap-2 min-w-[140px] justify-between">
                  <span>
                    {tierFilter === 'all' ? 'All Tiers' :
                      tierFilter === 'EARLY_BIRD' ? 'Early Bird' : 'Regular'}
                  </span>
                  <ChevronDown size={14} className="text-white/40" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border border-white/10 bg-[#0a0a0a] text-white min-w-[140px] z-50">
                  <DropdownMenuItem
                    onClick={() => handleTierFilterChange('all')}
                    className="hover:bg-white/10 cursor-pointer text-sm"
                  >
                    All Tiers
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleTierFilterChange('EARLY_BIRD')}
                    className="hover:bg-white/10 cursor-pointer text-sm font-medium text-emerald-400"
                  >
                    Early Bird
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleTierFilterChange('REGULAR')}
                    className="hover:bg-white/10 cursor-pointer text-sm font-medium text-white/80"
                  >
                    Regular
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-xl border border-white/10 bg-white/2 overflow-hidden">
            {/* Custom scrollbar styling via inline style for the table container */}
            <div className="overflow-x-auto" style={{ scrollbarWidth: 'auto', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              <style>{`
                div::-webkit-scrollbar {
                  height: 6px;
                }
                div::-webkit-scrollbar-track {
                  background: transparent;
                }
                div::-webkit-scrollbar-thumb {
                  background: rgba(255,255,255,0.1);
                  border-radius: 3px;
                }
                div::-webkit-scrollbar-thumb:hover {
                  background: rgba(255,255,255,0.2);
                }
              `}</style>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/2">
                    <th>
                      <button
                        onClick={() => handleSortBy('name')}
                        className="group flex items-center gap-1 px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-white/40 uppercase tracking-wider hover:text-white/60 transition-colors"
                      >
                        User
                        <SortIndicator column="name" />
                      </button>
                    </th>
                    <th>
                      <button
                        onClick={() => handleSortBy('tier')}
                        className="group flex items-center gap-1 px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-white/40 uppercase tracking-wider hover:text-white/60 transition-colors"
                      >
                        Tier
                        <SortIndicator column="tier" />
                      </button>
                    </th>
                    <th>
                      <button
                        onClick={() => handleSortBy('reservationNumber')}
                        className="group flex items-center gap-1 px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-white/40 uppercase tracking-wider hover:text-white/60 transition-colors"
                      >
                        Reservation
                        <SortIndicator column="reservationNumber" />
                      </button>
                    </th>
                    <th>
                      <button
                        onClick={() => handleSortBy('status')}
                        className="group flex items-center gap-1 px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-white/40 uppercase tracking-wider hover:text-white/60 transition-colors"
                      >
                        Status
                        <SortIndicator column="status" />
                      </button>
                    </th>
                    <th className="hidden sm:table-cell">
                      <button
                        onClick={() => handleSortBy('createdAt')}
                        className="group flex items-center gap-1 px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider hover:text-white/60 transition-colors"
                      >
                        Joined
                        <SortIndicator column="createdAt" />
                      </button>
                    </th>
                    <th className="text-right px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                {isRefreshing ? (
                  <TableSkeleton rows={8} />
                ) : (
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/3 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div>
                            <div className="text-sm font-medium text-white">{user.name}</div>
                            <div className="text-xs sm:text-sm text-white/40 hidden sm:block">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">{getTierBadge(user.tier)}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <span className="text-sm text-white/60">#{user.reservationNumber}</span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">{getStatusBadge(user.status)}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                          <span className="text-sm text-white/40">
                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                          <button
                            onClick={() => { setSelectedUser(user); setShowUpdateModal(true); }}
                            className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-xs font-medium"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>

            {!isRefreshing && filteredUsers.length === 0 && (
              <div className="text-center py-16">
                <Users size={48} className="mx-auto text-white/10 mb-4" />
                <p className="text-white/40 text-sm">No users found matching your filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {data.pagination.total > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">

                {/* Results Info & Rows per page */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto">
                  <span className="text-sm text-white/50 font-light tracking-wide whitespace-nowrap">
                    Showing <span className="text-white font-medium">{(data.pagination.page - 1) * data.pagination.limit + 1}-{Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)}</span> of <span className="text-white font-medium">{data.pagination.total}</span> users
                  </span>

                  <div className="hidden sm:block w-px h-4 bg-white/10" />

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white/40">Rows per page</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-white text-sm hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 min-w-[70px] justify-between focus:ring-2 focus:ring-white/10 focus:outline-none">
                        <span>{perPage}</span>
                        <ChevronDown size={14} className="text-white/40 group-hover:text-white/60" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="border border-white/10 bg-[#0a0a0a] text-white min-w-[70px] z-50 p-1">
                        {[5, 10, 20, 50, 100].map((limit) => (
                          <DropdownMenuItem
                            key={limit}
                            onClick={() => handlePerPageChange(limit)}
                            className={`rounded-md hover:bg-white/10 cursor-pointer text-sm justify-center py-1.5 ${perPage === limit ? 'bg-white/15 text-white font-medium' : 'text-white/70'
                              }`}
                          >
                            {limit}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Page Navigation */}
                {data.pagination.pages > 1 && (
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(data.pagination.page - 1)}
                      disabled={data.pagination.page === 1}
                      className="group flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
                    </button>

                    <div className="flex items-center gap-1.5 px-2">
                      {Array.from({ length: Math.min(data.pagination.pages, window.innerWidth < 640 ? 3 : 5) }, (_, i) => {
                        // Logic to show a sliding window of page numbers
                        const maxPagesToShow = window.innerWidth < 640 ? 3 : 5;
                        let pageNum: number;

                        // Simple sliding window logic centering the current page where possible
                        if (data.pagination.pages <= maxPagesToShow) {
                          pageNum = i + 1;
                        } else if (data.pagination.page <= Math.ceil(maxPagesToShow / 2)) {
                          pageNum = i + 1;
                        } else if (data.pagination.page >= data.pagination.pages - Math.floor(maxPagesToShow / 2)) {
                          pageNum = data.pagination.pages - maxPagesToShow + 1 + i;
                        } else {
                          pageNum = data.pagination.page - Math.floor(maxPagesToShow / 2) + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-300 border ${pageNum === data.pagination.page
                                ? 'bg-white text-black border-white shadow-[0_0_15px_-3px_rgba(255,255,255,0.3)] scale-105 z-10'
                                : 'bg-transparent border-transparent text-white/40 hover:text-white hover:bg-white/10'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(data.pagination.page + 1)}
                      disabled={data.pagination.page === data.pagination.pages}
                      className="group flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10"
                      aria-label="Next page"
                    >
                      <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedUser && (
        <ManageUserModal
          open={showUpdateModal}
          user={selectedUser}
          updating={updating}
          onClose={() => setShowUpdateModal(false)}
          onUpdateUser={handleUpdateUser}
          getTierBadge={getTierBadge}
          getStatusBadge={getStatusBadge}
        />
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <AdminContent />
    </Suspense>
  );
}
