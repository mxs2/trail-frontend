import { apiFetch } from './client';

export interface OnboardingProfile {
  targetRole: string;
  technicalDepth: 'beginner' | 'intermediate' | 'advanced';
  weeklyHours: '<5' | '5-10' | '10-20' | '20+';
  learningStyle: 'hands-on' | 'visual' | 'theoretical' | 'mixed';
  projectGoal: string;
}

export interface GenerateTrailResult {
  trailId: string;
  title: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SocraticChatPayload {
  challengeId: string;
  history: ChatMessage[];
  newMessage: string;
}

export interface AiReviewDraft {
  qualityAnalysis: string;
  edgeCases: string[];
  suggestedComment: string;
  suggestedDecision: 'Approved' | 'NeedsRevision';
}

export const aiApi = {
  async generateTrail(profile: OnboardingProfile): Promise<GenerateTrailResult> {
    return apiFetch('/ai/generate-trail', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  },

  async socraticChat(payload: SocraticChatPayload): Promise<{ reply: string }> {
    return apiFetch('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getReviewDraft(submissionId: string): Promise<AiReviewDraft> {
    return apiFetch<AiReviewDraft>(`/ai/review/${submissionId}`, { method: 'POST' });
  },
};
