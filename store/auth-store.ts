import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, LoginCredentials, RegisterCredentials } from '@/types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearError: () => void;
  updateProfile: (profile: Partial<User>) => void;

  // SSR hydration flag
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// Mock API response types
interface MockAuthResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Mock API functions (will be replaced with real API)
const mockAuthApi = {
  login: async (credentials: LoginCredentials): Promise<MockAuthResponse<{ id: string; email: string; name: string }>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo credentials
    if (credentials.email === 'demo@veo.com' && credentials.password === 'demo123') {
      return {
        success: true,
        data: {
          id: '1',
          email: 'demo@veo.com',
          name: 'Demo User',
        },
      };
    }

    // For testing, accept any email/password
    return {
      success: true,
      data: {
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
      },
    };
  },

  register: async (credentials: RegisterCredentials): Promise<MockAuthResponse<{ id: string; email: string; name: string }>> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      data: {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.name,
      },
    };
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  getSession: async (): Promise<MockAuthResponse<{ id: string; email: string; name: string }> & { noSession?: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Check if we have persisted auth state from localStorage
    // Since zustand persist handles this, we just need to not return success: false
    // Return that we couldn't determine session (let zustand handle the persisted state)
    return { success: false, noSession: true };
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await mockAuthApi.login(credentials);
          if (response.success) {
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
              error: null,
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

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await mockAuthApi.register(credentials);
          if (response.success) {
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
              error: null,
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
          await mockAuthApi.logout();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      checkSession: async () => {
        set({ isLoading: true });
        try {
          // For now, just check if we have a user in storage
          const response = await mockAuthApi.getSession();
          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
            });
          } else if (response.noSession) {
            // No session from API, but zustand persist will hydrate the state
            // Just stop loading, don't clear the auth state
            set({ isLoading: false });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch {
          // On error, just stop loading - zustand persist will handle the state
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),

      updateProfile: (profile: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...profile } : null,
        }));
      },
    }),
    {
      name: 'veo-auth-storage',
      storage: createJSONStorage(() => {
        // SSR-safe storage
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      // Only persist user and auth state
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
