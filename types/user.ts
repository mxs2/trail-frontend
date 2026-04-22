export type UserRole = 'aluno' | 'mentor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** Two-letter initials for avatar fallback, e.g. 'MS' for Matheus Silva. */
  avatarInitials: string;
  /** Gamification level (1-based). */
  level: number;
  /** ISO 8601 date string. */
  joinedAt: string;
}

export interface WeeklyActivity {
  /** Abbreviated day label in pt-BR, e.g. 'Seg', 'Ter'. */
  day: string;
  /** Minutes studied that day. */
  mins: number;
}
