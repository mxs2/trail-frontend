// Pure, framework-agnostic helpers shared across the app.
// Kept side-effect free so they are trivially unit-testable.

import type { Trail } from '../types';

/**
 * Two-letter uppercase initials for an avatar fallback.
 * 'Matheus Silva' -> 'MS', 'madonna' -> 'M', '' -> 'U'.
 */
export function getInitials(name: string): string {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? '')
      .join('') || 'U'
  );
}

/** Clamp a progress value into the valid 0–100 range. */
export function clampProgress(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

/**
 * Case-insensitive, accent-tolerant search over a trail's title and subtitle.
 * An empty/whitespace query returns the list unchanged.
 */
export function filterTrails(trails: Trail[], query: string): Trail[] {
  const normalized = normalize(query);
  if (!normalized) return trails;
  return trails.filter(
    (trail) =>
      normalize(trail.title).includes(normalized) || normalize(trail.subtitle).includes(normalized)
  );
}

/** Lowercase + strip diacritics so 'Próximo' matches 'proximo'. */
function normalize(value: string): string {
  return value.trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
}
