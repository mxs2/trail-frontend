'use client';

import type { User } from '../../types';
import { useAuthGuard } from './useAuthGuard';

interface RequireRoleProps {
  role: User['role'];
  children: React.ReactNode;
}

/**
 * Client-side guard that enforces a specific role.
 * Redirects to /signin when unauthenticated; to /dashboard when role mismatches.
 *
 * Delegates all logic to useAuthGuard.
 */
export default function RequireRole({ role, children }: RequireRoleProps) {
  const { hydrated, isAuthenticated, isAuthorized } = useAuthGuard(role);
  if (!hydrated || !isAuthenticated || !isAuthorized) return null;
  return <>{children}</>;
}
