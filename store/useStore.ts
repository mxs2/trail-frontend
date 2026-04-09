import { create } from 'zustand';
import { User, Trail } from '../types';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  // Main entity related state
  trails: Trail[];
  setTrails: (trails: Trail[]) => void;
  // Dashboard loading state
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  trails: [],
  setTrails: (trails) => set({ trails }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
