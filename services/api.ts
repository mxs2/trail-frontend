/**
 * Unified API facade. All domain modules are spread into a single `api` object
 * so existing call-sites don't need to change import paths.
 *
 * 401 → refresh → retry is handled transparently in lib/api/client.ts.
 */

import { authApi } from '../lib/api/auth';
import { trailsApi, mapTrail } from '../lib/api/trails';
import { submissionsApi } from '../lib/api/submissions';
import { aiApi } from '../lib/api/ai';

export type { TrailApiResponse, EnrollmentStatus } from '../lib/api/trails';
export type {
  OnboardingProfile,
  GenerateTrailResult,
  ChatMessage,
  AiReviewDraft,
} from '../lib/api/ai';

// ── Shared types ──────────────────────────────────────────────────────────────

export interface UserSettings {
  twoFactorEnabled: boolean;
  publicProfile: boolean;
  emailNotifications: boolean;
  studyReminder: boolean;
  aiSuggestions: boolean;
  weeklyReport: boolean;
  language: string;
  dailyStudyGoal: string;
  autoplay: boolean;
  subtitles: boolean;
}

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  challengeId: string;
  challengeTitle: string;
  trailName: string | null;
  gitHubUrl: string;
  submittedAt: string;
  status: 'Submitted' | 'Approved' | 'NeedsRevision';
  reviewerId: string | null;
  reviewerName: string | null;
  mentorComment: string | null;
  reviewedAt: string | null;
}

export interface GitHubMeta {
  type: 'repo' | 'gist';
  name: string;
  description: string | null;
  language: string | null;
  starCount: number | null;
  lastPushed: string | null;
  ownerAvatarUrl: string | null;
  htmlUrl: string | null;
}

// ── Unified API object ────────────────────────────────────────────────────────

export const api = {
  ...authApi,
  ...trailsApi,
  ...submissionsApi,
  ...aiApi,
};

export { mapTrail };
