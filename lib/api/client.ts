/**
 * Shared HTTP client with:
 *  - Bearer token injection
 *  - RFC 7807 ProblemDetails error parsing
 *  - Automatic 401 → refresh → retry (single attempt)
 *  - Force logout when refresh also fails
 *
 * This module owns ALL token I/O so token management is a single concern.
 */

const BASE_URL = '/api';

// ── Role mapping (backend string → frontend discriminated union) ──────────────

export const ROLE_MAP: Record<string, 'aluno' | 'mentor' | 'admin'> = {
  Student: 'aluno',
  Mentor: 'mentor',
  Manager: 'admin',
};

// ── Token storage ─────────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('trail_token');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('trail_refresh');
}

export function setTokens(token: string, refresh: string): void {
  localStorage.setItem('trail_token', token);
  localStorage.setItem('trail_refresh', refresh);
}

export function clearTokens(): void {
  localStorage.removeItem('trail_token');
  localStorage.removeItem('trail_refresh');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Token refresh ─────────────────────────────────────────────────────────────

let refreshPromise: Promise<boolean> | null = null;

/**
 * Attempts to exchange the stored refresh token for a new access token.
 * Coalesces concurrent refresh attempts so only one network request is made
 * even if multiple in-flight requests fail simultaneously with 401.
 */
async function tryRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const data = (await res.json()) as { token: string; refreshToken: string };
      setTokens(data.token, data.refreshToken);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function forceLogout(): never {
  clearTokens();
  // Clear Zustand user so RequireAuth redirects on next render
  if (typeof window !== 'undefined') {
    // Dispatch a storage event so other tabs pick up the logout
    localStorage.removeItem('trail-auth');
    window.location.href = '/signin';
  }
  throw new Error('Sessão expirada. Faça login novamente.');
}

// ── Generic fetch wrapper ─────────────────────────────────────────────────────

/**
 * Wraps `fetch` with:
 *  1. Auth header injection
 *  2. ProblemDetails error parsing
 *  3. 401 → refresh → retry (once)
 *  4. Force logout if refresh fails
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  _isRetry = false
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  // ── 401: attempt token refresh then retry once ────────────────────────────
  if (res.status === 401 && !_isRetry) {
    const refreshed = await tryRefresh();
    if (refreshed) return apiFetch<T>(path, options, true);
    forceLogout(); // never returns
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    let message = `HTTP ${res.status}`;
    try {
      const json = JSON.parse(body) as Record<string, unknown>;
      message = (json.detail as string) ?? (json.title as string) ?? message;
    } catch {
      if (body) message = body;
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}
