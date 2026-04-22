export type LessonType = 'video' | 'code' | 'doc';

// String range like 'Iniciante → Intermediário' is intentional — matches prototype data.
export type TrailLevel =
  | 'Iniciante'
  | 'Intermediário'
  | 'Avançado'
  | 'Iniciante → Intermediário'
  | 'Intermediário → Avançado';

export interface Lesson {
  id: string;
  title: string;
  /** Human-readable: '14min', '1h 30min', '-' (open-ended tasks). */
  duration: string;
  type: LessonType;
  done: boolean;
  current?: boolean;
}

export interface TrailModule {
  id: string;
  title: string;
  lessons: Lesson[];
  current?: boolean;
  /** Locked modules are visible but not accessible until prerequisites are done. */
  locked?: boolean;
}

export interface Trail {
  id: string;
  title: string;
  subtitle: string;
  /** Hex color used as the trail's accent (progress bar, module indicator). */
  color: string;
  /** 0–100 */
  progress: number;
  hoursTotal: number;
  hoursDone: number;
  lessonsTotal: number;
  lessonsDone: number;
  level: TrailLevel;
  /** Title of the next lesson to take. */
  nextLesson: string;
  /** Short AI-generated observation about the student's pace. */
  aiNote: string;
  modules: TrailModule[];
}

export interface AiSugestao {
  id: string;
  title: string;
  duration: string;
  type: LessonType;
}

export interface AiRecomendacao {
  titulo: string;
  descricao: string;
  sugestoes: AiSugestao[];
}

export interface TrilhaPersonalizada {
  trilhaPrincipal: Trail;
  recomendacao: AiRecomendacao;
  /** Short note from the assigned mentor. Empty string when no mentor is assigned. */
  notaDoMentor: string;
}
