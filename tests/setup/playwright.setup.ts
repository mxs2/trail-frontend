// Shared Playwright helpers. Keeps auth seeding, the login flow and the mocked
// backend in one place so specs stay focused on behaviour.
//
// The frontend now talks to a real backend via fetch('/api/...') (see
// lib/api/client.ts). CI runs the frontend only, so e2e specs intercept every
// `/api/**` request and serve deterministic fixtures via `mockBackend`.

import type { Page, Route } from '@playwright/test';
import { MOCK_USER } from '../../mocks/user';

const PERSIST_KEY = 'trail-auth';
const TOKEN_KEY = 'trail_token';
const REFRESH_KEY = 'trail_refresh';

// ── Backend fixtures (response shapes match lib/api/*) ────────────────────────

// LoginResponse (lib/api/auth.ts). Role uses the backend string; ROLE_MAP maps
// "Student" → "aluno".
const LOGIN_RESPONSE = {
  token: 'e2e-access-token',
  refreshToken: 'e2e-refresh-token',
  role: 'Student',
  name: MOCK_USER.name,
};

// UserSummaryResponse (lib/api/auth.ts → mapUser).
const PROFILE_RESPONSE = {
  id: MOCK_USER.id,
  name: MOCK_USER.name,
  email: MOCK_USER.email,
  role: 'Student',
  avatarInitials: MOCK_USER.avatarInitials,
  level: MOCK_USER.level,
  joinedAt: MOCK_USER.joinedAt,
};

// TrailApiResponse[] (lib/api/trails.ts → mapTrail).
const TRAILS_RESPONSE = [
  {
    id: 'react-fundamentals',
    name: 'React Fundamentals',
    description: 'Componentes, estado e o ciclo de vida moderno do React.',
    createdAt: '2026-01-01T00:00:00Z',
    challengesCount: 12,
    level: 'Iniciante',
    estimatedHours: 18,
  },
  {
    id: 'advanced-nextjs',
    name: 'Advanced Next.js',
    description: 'SSR, SSG e o App Router em profundidade.',
    createdAt: '2026-01-02T00:00:00Z',
    challengesCount: 8,
    level: 'Avançado',
    estimatedHours: 12,
  },
];

// GET /auth/activity/weekly — backend returns English day keys, mapped to PT.
const WEEKLY_ACTIVITY_RESPONSE = [
  { day: 'Mon', mins: 45 },
  { day: 'Tue', mins: 72 },
  { day: 'Wed', mins: 30 },
  { day: 'Thu', mins: 90 },
  { day: 'Fri', mins: 55 },
  { day: 'Sat', mins: 0 },
  { day: 'Sun', mins: 40 },
];

function json(route: Route, data: unknown, status = 200): Promise<void> {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(data),
  });
}

/**
 * Intercept every `/api/**` request and serve deterministic fixtures so e2e
 * specs run without a live backend. Must be installed before the first
 * navigation. Unmatched routes resolve to an empty array (never 401, which
 * would trigger a forced logout in the client).
 */
export async function mockBackend(page: Page): Promise<void> {
  await page.route('**/api/**', (route) => {
    const { pathname } = new URL(route.request().url());
    const path = pathname.replace(/^\/api/, '');
    const method = route.request().method();

    // ── Auth ────────────────────────────────────────────────────────────────
    if (path === '/auth/login' || path === '/auth/register') return json(route, LOGIN_RESPONSE);
    if (path === '/auth/profile' && method === 'GET') return json(route, PROFILE_RESPONSE);
    if (path === '/auth/activity/weekly') return json(route, WEEKLY_ACTIVITY_RESPONSE);
    if (path === '/auth/logout') return json(route, {});

    // ── Trails ──────────────────────────────────────────────────────────────
    if (path === '/trails' && method === 'GET') return json(route, TRAILS_RESPONSE);
    if (/^\/trails\/[^/]+\/challenges$/.test(path)) return json(route, []);
    if (/^\/trails\/[^/]+\/enrollment$/.test(path)) return json(route, { enrolled: true });
    if (/^\/trails\/[^/]+\/enroll$/.test(path)) return json(route, { enrolled: true });
    if (/^\/trails\/[^/]+$/.test(path) && method === 'GET') {
      const id = path.split('/')[2];
      const trail = TRAILS_RESPONSE.find((t) => t.id === id) ?? TRAILS_RESPONSE[0];
      return json(route, trail);
    }

    // ── Fallback ──────────────────────────────────────────────────────────────
    return json(route, []);
  });
}

/**
 * Seed an authenticated session by pre-populating the Zustand persist store
 * (matching zustand/middleware `persist`) and the auth tokens read by the API
 * client. Installs the mocked backend. Must be called before the first
 * navigation.
 */
export async function seedAuth(page: Page, user = MOCK_USER): Promise<void> {
  await mockBackend(page);
  await page.addInitScript(
    ([persistKey, tokenKey, refreshKey, value]) => {
      window.localStorage.setItem(
        persistKey as string,
        JSON.stringify({ state: { user: value, favorites: [] }, version: 0 })
      );
      window.localStorage.setItem(tokenKey as string, 'e2e-access-token');
      window.localStorage.setItem(refreshKey as string, 'e2e-refresh-token');
    },
    [PERSIST_KEY, TOKEN_KEY, REFRESH_KEY, user] as const
  );
}

/** Drive the real sign-in form end to end and wait for the dashboard. */
export async function signInViaUi(
  page: Page,
  email = 'matheus.silva@trail.dev',
  password = 'super-secret'
): Promise<void> {
  await mockBackend(page);
  await page.goto('/signin');
  await page.getByLabel(/e-mail/i).fill(email);
  await page.getByLabel(/^senha/i).fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL('**/dashboard');
}
