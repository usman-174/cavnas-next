import { Search, ChevronDown } from 'lucide-react';

/**
 * Admin Skeleton Loading Component
 * Professional skeleton UI for admin dashboard loading state
 */
export function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5 animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                <div className="h-3 w-48 bg-white/5 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="space-y-1 hidden sm:block">
                <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
              </div>
              <div className="h-9 w-20 bg-white/5 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Summary Stats Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-white/5 animate-pulse">
                    <div className="h-4 w-4 rounded" />
                  </div>
                  <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
                </div>
                <div className="h-8 w-12 bg-white/10 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Filters Bar Skeleton */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <div className="w-full h-10 pl-11 pr-4 rounded-lg bg-white/5 animate-pulse" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-36 rounded-lg bg-white/5 animate-pulse flex items-center justify-center">
                <ChevronDown size={14} className="text-white/20" />
              </div>
              <div className="h-10 w-36 rounded-lg bg-white/5 animate-pulse flex items-center justify-center">
                <ChevronDown size={14} className="text-white/20" />
              </div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Tier</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Reservation</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Joined</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[...Array(8)].map((_, i) => (
                    <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                          <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-16 bg-white/10 rounded animate-pulse" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-12 bg-white/5 rounded animate-pulse" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-16 bg-white/10 rounded animate-pulse" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex h-8 w-16 bg-white/5 rounded-lg animate-pulse" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 w-10 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Table rows skeleton for refetching/refreshing data
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <tbody className="divide-y divide-white/5">
      {[...Array(rows)].map((_, i) => (
        <tr key={i} className="hover:bg-white/[0.03] transition-colors">
          <td className="px-6 py-4">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="h-6 w-16 bg-white/10 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-12 bg-white/5 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-6 w-16 bg-white/10 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4 text-right">
            <div className="inline-flex h-8 w-16 bg-white/5 rounded-lg animate-pulse" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}
