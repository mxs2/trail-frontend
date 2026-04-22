import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Trail, Lesson, TrilhaPersonalizada } from '../types';

interface AppState {
  // auth
  user: User | null;
  setUser: (user: User | null) => void;
  // trails list (sidebar + dashboard)
  trails: Trail[];
  setTrails: (trails: Trail[]) => void;
  // active trail (trilha/[id] page)
  currentTrail: Trail | null;
  setCurrentTrail: (trail: Trail | null) => void;
  // active lesson (aula/[id] page)
  currentLesson: Lesson | null;
  setCurrentLesson: (lesson: Lesson | null) => void;
  // AI personalization for the logged-in user
  aiRecomendacao: TrilhaPersonalizada | null;
  setAiRecomendacao: (rec: TrilhaPersonalizada | null) => void;
  // global loading flag
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),

      trails: [],
      setTrails: (trails) => set({ trails }),

      currentTrail: null,
      setCurrentTrail: (currentTrail) => set({ currentTrail }),

      currentLesson: null,
      setCurrentLesson: (currentLesson) => set({ currentLesson }),

      aiRecomendacao: null,
      setAiRecomendacao: (aiRecomendacao) => set({ aiRecomendacao }),

      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'trail-auth',
      // Only user survives page refresh. Everything else is re-fetched on mount.
      partialize: (state) => ({ user: state.user }),
    }
  )
);
