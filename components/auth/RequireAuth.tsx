'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store/useStore';

/**
 * Client-side route guard for the authenticated `(app)` area. Redirects to the
 * sign-in page when there is no user in the (persisted) store. Auth state lives
 * in localStorage today, so the guard runs on the client rather than middleware.
 *
 * The redirect is gated on the persisted store having finished rehydrating:
 * otherwise a slow rehydration could briefly read `user === null` and bounce an
 * already-authenticated user to /signin.
 */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useStore((s) => s.user);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(() => useStore.persist?.hasHydrated() ?? false);

  // Subscribe to rehydration completion (setState lives in the callback, not the
  // effect body) and unsubscribe on unmount.
  useEffect(() => useStore.persist?.onFinishHydration(() => setHydrated(true)) ?? (() => {}), []);

  useEffect(() => {
    if (hydrated && !user) router.replace('/signin');
  }, [hydrated, user, router]);

  if (!hydrated || !user) return null;
  return <>{children}</>;
}
