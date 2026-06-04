/**
 * Central re-export point for all API modules.
 * Import from here for a unified `api` object compatible with the existing
 * call-sites that use `api.login(...)`, `api.getTrails(...)`, etc.
 */

export { apiFetch, setTokens, clearTokens, getToken, getRefreshToken } from './client';
export { authApi } from './auth';
export { trailsApi, mapTrail } from './trails';
export type { TrailApiResponse, EnrollmentStatus } from './trails';
export { submissionsApi } from './submissions';
