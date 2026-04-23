import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Trail, Lesson, TrilhaPersonalizada } from '../types';
import { MOCK_TRAILS } from '../mocks/trails';

interface AppState {
  // auth
  user: User | null;
  setUser: (user: User | null) => void;
  // trails list (sidebar + dashboard + trilha/[id])
  trails: Trail[];
  setTrails: (trails: Trail[]) => void;
  toggleLesson: (trailId: string, lessonId: string) => void;
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

      trails: MOCK_TRAILS,
      setTrails: (trails) => set({ trails }),
      toggleLesson: (trailId, lessonId) =>
        set((state) => ({
          trails: state.trails.map((t) => {
            if (t.id !== trailId) return t;
            const modules = t.modules.map((m) => ({
              ...m,
              lessons: m.lessons.map((l) => (l.id !== lessonId ? l : { ...l, done: !l.done })),
            }));
            const total = modules.reduce((a, m) => a + m.lessons.length, 0);
            const done = modules.reduce((a, m) => a + m.lessons.filter((l) => l.done).length, 0);
            const progress = Math.round((done / total) * 100);
            const hoursDone = Math.round((progress / 100) * t.hoursTotal * 10) / 10;
            return { ...t, modules, lessonsDone: done, progress, hoursDone };
          }),
        })),

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
      // Only user survives page refresh. Everything else is re-fetched from mocks.
      partialize: (state) => ({ user: state.user }),
    }
  )
);
