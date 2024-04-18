'use client';
import { SessionProvider } from 'next-auth/react';

/**
 * Using nextauth within client-side components requires wrapping them within
 * {@link SessionProvider}. However, the root layout component is server-side,
 * so we have this client-rendered provider to wrap the entire app.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
