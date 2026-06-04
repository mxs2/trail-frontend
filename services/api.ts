import type { Trail, Lesson } from '../types';
import type { User, WeeklyActivity } from '../types';
import { MOCK_TRAILS } from '../mocks/trails';
import { MOCK_USER } from '../mocks/user';
import { WEEKLY_ACTIVITY } from '../mocks/activity';

const delay = <T>(value: T, ms: number): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

function initials(name: string): string {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('') || 'U'
  );
}

// ── Auth: POST /auth/register ─────────────────────────────────────────────────
// ── Auth: POST /auth/login ────────────────────────────────────────────────────
// ── Auth: GET  /auth/me ───────────────────────────────────────────────────────
// ── Auth: POST /auth/refresh ──────────────────────────────────────────────────
// ── Auth: POST /auth/logout ───────────────────────────────────────────────────
// ── Auth: GET  /auth/profile ──────────────────────────────────────────────────
// ── Auth: PUT  /auth/profile ──────────────────────────────────────────────────
// ── Auth: GET  /auth/settings ─────────────────────────────────────────────────
// ── Auth: PUT  /auth/settings ─────────────────────────────────────────────────
// ── Auth: GET  /auth/activity/weekly ─────────────────────────────────────────
// ── Trails: GET /trails ───────────────────────────────────────────────────────
// ── Trails: GET /trails/{id}/challenges ──────────────────────────────────────
// ── Students: GET /students/{id}/progress ────────────────────────────────────
// ── Submissions: POST /submissions ───────────────────────────────────────────
// ── Submissions: GET  /submissions ───────────────────────────────────────────
// ── Submissions: PUT  /submissions/{id}/review ────────────────────────────────

export const api = {
  // ── Auth ────────────────────────────────────────────────────────────────────

  async register(name: string, email: string, _password: string): Promise<User> {
    return delay({ ...MOCK_USER, name, email, avatarInitials: initials(name) }, 800);
  },

  async login(_email: string, _password: string): Promise<User> {
    return delay({ ...MOCK_USER }, 600);
  },

  async getMe(): Promise<User> {
    return delay({ ...MOCK_USER }, 300);
  },

  async refresh(_token: string): Promise<{ accessToken: string }> {
    return delay({ accessToken: 'mock-access-token' }, 300);
  },

  async logout(_token: string): Promise<void> {
    return delay(undefined as unknown as void, 200);
  },

  async getProfile(): Promise<User> {
    return delay({ ...MOCK_USER }, 300);
  },

  async updateProfile(data: Partial<Pick<User, 'name' | 'email'>>): Promise<User> {
    return delay({ ...MOCK_USER, ...data }, 400);
  },

  async getSettings(): Promise<Record<string, unknown>> {
    return delay({}, 300);
  },

  async updateSettings(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    return delay(data, 400);
  },

  async getWeeklyActivity(): Promise<WeeklyActivity[]> {
    return delay([...WEEKLY_ACTIVITY], 300);
  },

  // ── Trails ──────────────────────────────────────────────────────────────────

  async getTrails(): Promise<Trail[]> {
    return delay([...MOCK_TRAILS], 500);
  },

  async getTrailChallenges(_trailId: string): Promise<unknown[]> {
    return delay([], 400);
  },

  // ── Students ────────────────────────────────────────────────────────────────

  async getStudentProgress(_studentId: string): Promise<unknown> {
    return delay({}, 400);
  },

  // ── Submissions ─────────────────────────────────────────────────────────────

  async createSubmission(_data: unknown): Promise<unknown> {
    return delay({}, 500);
  },

  async getSubmissions(): Promise<unknown[]> {
    return delay([], 400);
  },

  async reviewSubmission(_id: string, _data: unknown): Promise<unknown> {
    return delay({}, 400);
  },

  // ── Local cache helpers (no backend counterpart) ─────────────────────────────

  findTrailById(id: string): Trail | undefined {
    return MOCK_TRAILS.find((t) => t.id === id);
  },

  findLessonById(id: string): Lesson | undefined {
    for (const trail of MOCK_TRAILS) {
      for (const mod of trail.modules) {
        const lesson = mod.lessons.find((l) => l.id === id);
        if (lesson) return lesson;
      }
    }
    return undefined;
  },

  async requestPasswordReset(_email: string): Promise<{ ok: true }> {
    // Always resolves in the prototype — a real backend would email a reset link.
    return delay({ ok: true }, 600);
  },
};
