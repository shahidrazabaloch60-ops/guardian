import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setCredentials: (user: User, token: string, refreshToken: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      setCredentials: (user, token, refreshToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('guardianrs_token', token);
          localStorage.setItem('guardianrs_refresh_token', refreshToken);
        }
        set({ user, token, refreshToken, isAuthenticated: true, isLoading: false });
      },
      updateUser: (updatedFields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        })),
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('guardianrs_token');
          localStorage.removeItem('guardianrs_refresh_token');
        }
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'guardianrs_auth_storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
