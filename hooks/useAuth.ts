// hooks/useAuth.ts
// Custom hook for authentication state

'use client';

import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
    isAdmin: session?.user?.role === 'ADMIN',
    isSaccoAdmin: session?.user?.role === 'SACCO_ADMIN',
  };
}

