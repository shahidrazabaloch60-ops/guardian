'use client';

import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, setCredentials, logout, updateUser } = useAuthStore();
  
  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    setCredentials,
    logout,
    updateUser,
    isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
    isStaff: user?.role === 'STAFF',
    isCustomer: user?.role === 'CUSTOMER',
  };
}
