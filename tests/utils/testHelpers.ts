// Reusable, side-effect-light helpers shared across suites.

import { useStore } from '@/store/useStore';
import { MOCK_TRAILS } from '@/mocks/trails';
import type { User } from '@/types';
import { userFixture } from '../fixtures/user';

/**
 * Reset the Zustand store to its initial data state between tests.
 * Actions are preserved (no `replace: true`); only data fields are cleared.
 */
export function resetStore(): void {
  useStore.setState({
    user: null,
    trails: MOCK_TRAILS,
    currentTrail: null,
    currentLesson: null,
    favorites: [],
    aiRecommendation: null,
    isLoading: false,
  });
  // Persisted slice ('trail-auth') would otherwise leak across tests.
  if (typeof window !== 'undefined') {
    window.localStorage.clear();
  }
}

/** Seed an authenticated user into the store (defaults to the fixture user). */
export function seedUser(user: User = userFixture): void {
  useStore.setState({ user });
}
