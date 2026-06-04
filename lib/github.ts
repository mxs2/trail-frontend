/**
 * Client-side GitHub URL validation utilities.
 * Mirrors the regex in CreateSubmissionRequest.cs — keep them in sync.
 *
 * Valid patterns:
 *   Repo: https://github.com/{user}/{repo}[/...]
 *   Gist: https://gist.github.com/{user}/{hexId}
 */

const REPO_RE = /^https:\/\/github\.com\/([\w.\-]+)\/([\w.\-]+)(\/.*)?$/i;
const GIST_RE = /^https:\/\/gist\.github\.com\/([\w.\-]+)\/([0-9a-f]+)\/?$/i;

export type GitHubUrlKind = 'repo' | 'gist' | 'invalid';

export interface GitHubUrlInfo {
  kind: GitHubUrlKind;
  /** Short display label, e.g. "user/repo" or "user/abc123" */
  label: string;
}

export function parseGitHubUrl(raw: string): GitHubUrlInfo {
  const url = raw.trim();

  const gist = url.match(GIST_RE);
  if (gist) return { kind: 'gist', label: `${gist[1]}/${gist[2].slice(0, 7)}` };

  const repo = url.match(REPO_RE);
  if (repo) return { kind: 'repo', label: `${repo[1]}/${repo[2]}` };

  return { kind: 'invalid', label: '' };
}

export function isValidGitHubUrl(url: string): boolean {
  return parseGitHubUrl(url).kind !== 'invalid';
}

/** Extract a YouTube video ID from common YouTube URL formats. */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?(?:.*&)?v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/embed\/([^?&#]+)/,
    /youtube\.com\/shorts\/([^?&#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}
