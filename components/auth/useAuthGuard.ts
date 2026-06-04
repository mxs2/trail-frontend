'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store/useStore';
import { api } from '../../services/api';
import type { User } from '../../types';

interface AuthGuardResult {
  /** Zustand store has finished rehydrating from localStorage. */
  hydrated: boolean;
  /** User is present in store (does not validate token freshness). */
  isAuthenticated: boolean;
  /** User has the required role, or no role was required. */
  isAuthorized: boolean;
  /** Current user or null. */
  user: User | null;
}

/**
 * Unified auth + role guard hook.
 *
 * Replaces the duplicated logic that was spread across RequireAuth and
 * RequireRole. Both components are now thin wrappers around this hook.
 *
 * Behaviour:
 *  - Waits for Zustand to finish rehydrating from localStorage.
 *  - Redirects to /signin when no user is found.
 *  - Redirects to /dashboard when a role mismatch is detected.
 *  - Fetches the trail list once on first authenticated mount (if empty).
 *
 * @param requiredRole  Optional role to enforce. Pass undefined for
 *                      "authenticated but any role" (original RequireAuth).
 */
export function useAuthGuard(requiredRole?: User['role']): AuthGuardResult {
  const user = useStore((s) => s.user);
  const trails = useStore((s) => s.trails);
  const setTrails = useStore((s) => s.setTrails);
  const router = useRouter();

  const [hydrated, setHydrated] = useState(() => useStore.persist?.hasHydrated() ?? false);

  // Detect when Zustand finishes reading localStorage
  useEffect(() => useStore.persist?.onFinishHydration(() => setHydrated(true)) ?? (() => {}), []);

  // Redirect based on auth/role state
  useEffect(() => {
    if (!hydrated) return;

    if (!user) {
      router.replace('/signin');
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.replace('/dashboard');
    }
  }, [hydrated, user, requiredRole, router]);

  // Seed trail list once per session (fires from the outermost layout guard)
  useEffect(() => {
    const ready = hydrated && !!user;
    const roleOk = !requiredRole || user?.role === requiredRole;
    if (ready && roleOk && trails.length === 0) {
      api
        .getTrails()
        .then(setTrails)
        .catch(() => {});
    }
  }, [hydrated, user, requiredRole, trails.length, setTrails]);

  const isAuthenticated = hydrated && !!user;
  const isAuthorized = !requiredRole || user?.role === requiredRole;

  return { hydrated, isAuthenticated, isAuthorized, user };
}
