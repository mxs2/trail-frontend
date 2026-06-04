import type { User, WeeklyActivity } from '../../types';
import { apiFetch, ROLE_MAP, setTokens, clearTokens, getRefreshToken } from './client';
import type { UserSettings } from '../../services/api';

// ── Internal response shapes ──────────────────────────────────────────────────

interface LoginResponse {
  token: string;
  refreshToken: string;
  role: string;
  name: string;
}

interface UserSummaryResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
  level: number;
  joinedAt: string;
}

// ── Mapping ───────────────────────────────────────────────────────────────────

export function mapUser(u: UserSummaryResponse): User {
  const initials =
    u.avatarInitials ||
    u.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('') ||
    'U';
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: ROLE_MAP[u.role] ?? 'aluno',
    avatarInitials: initials,
    level: u.level,
    joinedAt: u.joinedAt,
  };
}

// ── Auth API methods ──────────────────────────────────────────────────────────

async function loginWithTokens(resp: LoginResponse): Promise<User> {
  setTokens(resp.token, resp.refreshToken);
  const profile = await apiFetch<UserSummaryResponse>('/auth/profile');
  return mapUser(profile);
}

export const authApi = {
  async register(name: string, email: string, password: string): Promise<User> {
    const resp = await apiFetch<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role: 0 }),
    });
    return loginWithTokens(resp);
  },

  async login(email: string, password: string): Promise<User> {
    const resp = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return loginWithTokens(resp);
  },

  async getMe(): Promise<User> {
    return mapUser(await apiFetch<UserSummaryResponse>('/auth/profile'));
  },

  async logout(): Promise<void> {
    const refreshToken = getRefreshToken() ?? '';
    try {
      await apiFetch('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } finally {
      clearTokens();
    }
  },

  async getProfile(): Promise<User> {
    return mapUser(await apiFetch<UserSummaryResponse>('/auth/profile'));
  },

  async updateProfile(name: string): Promise<User> {
    await apiFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
    return authApi.getProfile();
  },

  async getSettings(): Promise<UserSettings> {
    return apiFetch<UserSettings>('/auth/settings');
  },

  async updateSettings(data: UserSettings): Promise<UserSettings> {
    await apiFetch('/auth/settings', { method: 'PUT', body: JSON.stringify(data) });
    return data;
  },

  async getWeeklyActivity(): Promise<WeeklyActivity[]> {
    const DAY_PT: Record<string, string> = {
      Mon: 'Seg',
      Tue: 'Ter',
      Wed: 'Qua',
      Thu: 'Qui',
      Fri: 'Sex',
      Sat: 'Sáb',
      Sun: 'Dom',
    };
    const items = await apiFetch<Array<{ day: string; mins: number }>>('/auth/activity/weekly');
    return items.map((d) => ({ day: DAY_PT[d.day] ?? d.day, mins: d.mins }));
  },

  async getMentorStats(): Promise<{
    reviewsDone: number;
    approved: number;
    needsRevision: number;
    pendingInQueue: number;
  }> {
    return apiFetch('/auth/mentor-stats');
  },

  async requestPasswordReset(_email: string): Promise<{ ok: true }> {
    return { ok: true };
  },
};
