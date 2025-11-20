// app/providers.tsx
// Client-side providers wrapper

'use client';

import SessionProvider from '@/components/SessionProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider session={null}>
      {children}
    </SessionProvider>
  );
}

