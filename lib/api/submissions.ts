import { apiFetch } from './client';
import type { Submission, GitHubMeta } from '../../services/api';

export const submissionsApi = {
  async createSubmission(data: { challengeId: string; gitHubUrl: string }): Promise<Submission> {
    return apiFetch<Submission>('/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getSubmissions(): Promise<Submission[]> {
    return apiFetch<Submission[]>('/submissions');
  },

  async reviewSubmission(
    id: string,
    data: { decision: 'Approved' | 'NeedsRevision'; comment?: string }
  ): Promise<Submission> {
    return apiFetch<Submission>(`/submissions/${id}/review`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getPendingCount(): Promise<number> {
    const { count } = await apiFetch<{ count: number }>('/submissions/pending/count');
    return count;
  },

  async getStudentProgress(studentId: string): Promise<unknown> {
    return apiFetch(`/students/${studentId}/progress`);
  },

  async getGitHubMeta(url: string): Promise<GitHubMeta> {
    return apiFetch<GitHubMeta>(`/github/meta?url=${encodeURIComponent(url)}`);
  },
};
