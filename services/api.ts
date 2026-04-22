import type { Trail, Lesson, TrilhaPersonalizada } from '../types';
import type { User, WeeklyActivity } from '../types';
import { MOCK_TRAILS } from '../mocks/trails';
import { MOCK_USER } from '../mocks/user';
import { WEEKLY_ACTIVITY } from '../mocks/activity';
import { getTrilhaPersonalizada as getTrilhaPersonalizadaMock } from '../mocks/getTrilhaPersonalizada';

const delay = <T>(value: T, ms: number): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const api = {
  async getTrails(): Promise<Trail[]> {
    return delay([...MOCK_TRAILS], 500);
  },

  async getTrailById(id: string): Promise<Trail | undefined> {
    return delay(MOCK_TRAILS.find((t) => t.id === id), 500);
  },

  async getLessonById(id: string): Promise<Lesson | undefined> {
    for (const trail of MOCK_TRAILS) {
      for (const mod of trail.modules) {
        const lesson = mod.lessons.find((l) => l.id === id);
        if (lesson) return delay(lesson, 400);
      }
    }
    return delay(undefined, 400);
  },

  async getUser(): Promise<User> {
    return delay({ ...MOCK_USER }, 300);
  },

  async getWeeklyActivity(): Promise<WeeklyActivity[]> {
    return delay([...WEEKLY_ACTIVITY], 300);
  },

  async getTrilhaPersonalizada(userId: string): Promise<TrilhaPersonalizada> {
    return getTrilhaPersonalizadaMock(userId);
  },
};
