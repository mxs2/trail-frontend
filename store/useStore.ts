import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Trail } from '../types';

interface AppState {
  // ── Auth ──────────────────────────────────────────────────────────────────
  user: User | null;
  setUser: (user: User | null) => void;

  // ── Trails ────────────────────────────────────────────────────────────────
  trails: Trail[];
  setTrails: (trails: Trail[]) => void;

  /**
   * Updates a single trail's computed progress fields after challenges load.
   * Called from the trail detail page once we know how many challenges
   * are Approved. This propagates real progress into the dashboard and
   * progress page without a full trail list refetch.
   */
  updateTrailProgress: (trailId: string, approved: number, total: number) => void;

  // ── Favorites ─────────────────────────────────────────────────────────────
  favorites: string[];
  toggleFavorite: (trailId: string) => void;
  isFavorite: (trailId: string) => boolean;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Auth ────────────────────────────────────────────────────────────
      user: null,
      setUser: (user) => set({ user }),

      // ── Trails ──────────────────────────────────────────────────────────
      trails: [],
      setTrails: (trails) => set({ trails }),

      updateTrailProgress: (trailId, approved, total) =>
        set((state) => ({
          trails: state.trails.map((t) => {
            if (t.id !== trailId) return t;
            const progress = total > 0 ? Math.round((approved / total) * 100) : 0;
            const hoursTotal = t.hoursTotal;
            const hoursDone = Math.round((progress / 100) * hoursTotal * 10) / 10;
            return { ...t, progress, lessonsDone: approved, lessonsTotal: total, hoursDone };
          }),
        })),

      // ── Favorites ────────────────────────────────────────────────────────
      favorites: [],
      toggleFavorite: (trailId) =>
        set((state) => ({
          favorites: state.favorites.includes(trailId)
            ? state.favorites.filter((id) => id !== trailId)
            : [...state.favorites, trailId],
        })),
      isFavorite: (trailId) => get().favorites.includes(trailId),
    }),
    {
      name: 'trail-auth',
      // Only user + favorites survive a browser refresh.
      // Trails are re-fetched by RequireAuth/useAuthGuard on each session.
      partialize: (state) => ({ user: state.user, favorites: state.favorites }),
    }
  )
);
