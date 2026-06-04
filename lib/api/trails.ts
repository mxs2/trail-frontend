import type { Trail, Challenge } from '../../types';
import { apiFetch } from './client';

// ── Response shapes ───────────────────────────────────────────────────────────

export interface TrailApiResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  challengesCount: number;
  level: string | null;
  estimatedHours: number | null;
}

export interface EnrollmentStatus {
  enrolled: boolean;
}

// ── Stable colour palette ─────────────────────────────────────────────────────

const TRAIL_COLORS = [
  '#FF6200',
  '#A78BFA',
  '#5EEAD4',
  '#F59E0B',
  '#34D399',
  '#60A5FA',
  '#F87171',
  '#818CF8',
];

function stableColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return TRAIL_COLORS[hash % TRAIL_COLORS.length];
}

// ── Mapping ───────────────────────────────────────────────────────────────────

export function mapTrail(t: TrailApiResponse): Trail {
  return {
    id: t.id,
    title: t.name,
    subtitle: t.description,
    color: stableColor(t.id),
    progress: 0,
    hoursTotal: t.estimatedHours ?? 0,
    hoursDone: 0,
    lessonsTotal: t.challengesCount,
    lessonsDone: 0,
    level: (t.level as Trail['level']) ?? 'Iniciante',
    nextLesson: '',
    aiNote: '',
    modules: [],
  };
}

// ── Trail API methods ─────────────────────────────────────────────────────────

export const trailsApi = {
  // ── Queries ────────────────────────────────────────────────────────────────

  async getTrails(): Promise<Trail[]> {
    const trails = await apiFetch<TrailApiResponse[]>('/trails');
    return trails.map(mapTrail);
  },

  async getTrailById(id: string): Promise<TrailApiResponse> {
    return apiFetch<TrailApiResponse>(`/trails/${id}`);
  },

  async getTrailChallenges(trailId: string): Promise<Challenge[]> {
    return apiFetch<Challenge[]>(`/trails/${trailId}/challenges`);
  },

  // ── Enrollment ─────────────────────────────────────────────────────────────

  async enrollTrail(trailId: string): Promise<EnrollmentStatus> {
    await apiFetch(`/trails/${trailId}/enroll`, { method: 'POST' });
    return { enrolled: true };
  },

  async getEnrollment(trailId: string): Promise<EnrollmentStatus> {
    return apiFetch<EnrollmentStatus>(`/trails/${trailId}/enrollment`);
  },

  // ── Manager CRUD ───────────────────────────────────────────────────────────

  async createTrail(data: { name: string; description: string }): Promise<Trail> {
    const raw = await apiFetch<TrailApiResponse>('/trails', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return mapTrail(raw);
  },

  async updateTrail(id: string, data: { name: string; description: string }): Promise<Trail> {
    const raw = await apiFetch<TrailApiResponse>(`/trails/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return mapTrail(raw);
  },

  async deleteTrail(id: string): Promise<void> {
    return apiFetch(`/trails/${id}`, { method: 'DELETE' });
  },

  // ── Challenge CRUD ─────────────────────────────────────────────────────────

  async addChallenge(
    trailId: string,
    data: { title: string; description: string; order: number; youTubeUrl?: string }
  ): Promise<Challenge> {
    return apiFetch<Challenge>(`/trails/${trailId}/challenges`, {
      method: 'POST',
      body: JSON.stringify({ ...data, YouTubeUrl: data.youTubeUrl }),
    });
  },

  async updateChallenge(
    trailId: string,
    challengeId: string,
    data: { title: string; description: string; order: number; youTubeUrl?: string }
  ): Promise<Challenge> {
    return apiFetch<Challenge>(`/trails/${trailId}/challenges/${challengeId}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, YouTubeUrl: data.youTubeUrl }),
    });
  },

  async deleteChallenge(trailId: string, challengeId: string): Promise<void> {
    return apiFetch(`/trails/${trailId}/challenges/${challengeId}`, { method: 'DELETE' });
  },
};
