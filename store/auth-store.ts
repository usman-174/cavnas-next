import { create } from 'zustand';
import type { User, LoginCredentials, CabRegisterCredentials, CabUser, TierType, UserRole } from '@/types';

interface AuthStore {
  user: CabUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: CabRegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearError: () => void;
  updateProfile: (profile: Partial<CabUser>) => void;
  isAdmin: () => boolean;

  // SSR hydration flag - now used to track if we've fetched from server
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// API helper function
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
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

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  _hasHydrated: false,

  setHasHydrated: (state) => set({ _hasHydrated: state }),

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiCall<{ id: string; email: string; name: string; tier: TierType; reservationNumber: number; role: UserRole; status: string; createdAt: string }>(
        '/api/auth/login',
        {
          method: 'POST',
          body: JSON.stringify(credentials),
        }
      );

      if (response.success && response.data) {
        set({
          user: response.data as CabUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          _hasHydrated: true,
        });
        return true;
      } else {
        set({
          error: response.error || 'Login failed',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error: 'Network error. Please try again.',
        isLoading: false,
      });
      return false;
    }
  },

  register: async (credentials: CabRegisterCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiCall<{ id: string; email: string; name: string; tier: TierType; reservationNumber: number; role: UserRole; status: string; createdAt: string }>(
        '/api/auth',
        {
          method: 'POST',
          body: JSON.stringify(credentials),
        }
      );

      if (response.success && response.data) {
        set({
          user: response.data as CabUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          _hasHydrated: true,
        });
        return true;
      } else {
        set({
          error: response.error || 'Registration failed',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error: 'Network error. Please try again.',
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // Call logout API to clear cookie
      await apiCall('/api/auth/logout', { method: 'POST' });
    } catch {
      // Continue with local cleanup even if API call fails
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        _hasHydrated: true,
      });
    }
  },

  checkSession: async () => {
    set({ isLoading: true });
    try {
      // Validate session with server
      const response = await apiCall<CabUser>('/api/auth/session');

      if (response.success && response.data) {
        set({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
          _hasHydrated: true,
        });
      } else {
        // Session invalid, clear auth
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          _hasHydrated: true,
        });
      }
    } catch {
      // On error, just stop loading
      set({ isLoading: false, _hasHydrated: true });
    }
  },

  clearError: () => set({ error: null }),

  updateProfile: (profile: Partial<CabUser>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...profile } : null,
    }));
  },

  isAdmin: () => {
    const { user } = get();
    return user?.role === 'ADMIN';
  },
}));
