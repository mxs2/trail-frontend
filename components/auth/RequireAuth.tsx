'use client';

import { useAuthGuard } from './useAuthGuard';

/**
 * Client-side guard for the authenticated `(app)` area.
 * Accepts any authenticated role; redirect to /signin when unauthenticated.
 *
 * Delegates all logic to useAuthGuard — this component exists only to give
 * the layout a declarative JSX interface.
 */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { hydrated, isAuthenticated } = useAuthGuard();
  if (!hydrated || !isAuthenticated) return null;
  return <>{children}</>;
}
