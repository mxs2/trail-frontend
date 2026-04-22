// Source: design-reference/prototype/src/data.js (window.TRAILS)
// IDs for modules and lessons were added here — the prototype had none.
// lessonsTotal / lessonsDone for trails 2 & 3 exceed the modules shown because
// the prototype only renders active/recent modules; full lists come from the API in production.

import type { Trail } from '../types';

export const MOCK_TRAILS: Trail[] = [
  {
    id: 'react-fundamentals',
    title: 'React Fundamentals',
    subtitle: 'Componentes, estado e o ciclo de vida moderno do React',
    color: '#FF6200',
    progress: 62,
    hoursTotal: 18,
    hoursDone: 11.2,
    lessonsTotal: 24,
    lessonsDone: 15,
    level: 'Iniciante → Intermediário',
    nextLesson: 'Context API e useContext',
    aiNote: 'Você está 18% à frente do ritmo. Posso aumentar a densidade?',
    modules: [
      {
        id: 'rf-m0',
        title: 'Fundamentos',
        lessons: [
          { id: 'rf-m0-l0', title: 'O que é React?', duration: '08min', type: 'video', done: true },
          { id: 'rf-m0-l1', title: 'JSX e componentes', duration: '14min', type: 'video', done: true },
          { id: 'rf-m0-l2', title: 'Props vs. state', duration: '12min', type: 'video', done: true },
          { id: 'rf-m0-l3', title: 'Exercício: Card de perfil', duration: '30min', type: 'code', done: true },
        ],
      },
      {
        id: 'rf-m1',
        title: 'Estado e eventos',
        lessons: [
          { id: 'rf-m1-l0', title: 'useState, passo a passo', duration: '18min', type: 'video', done: true },
          { id: 'rf-m1-l1', title: 'Listas e keys', duration: '11min', type: 'video', done: true },
          { id: 'rf-m1-l2', title: 'Formulários controlados', duration: '22min', type: 'video', done: true },
          { id: 'rf-m1-l3', title: 'Exercício: Todo list', duration: '45min', type: 'code', done: true },
        ],
      },
      {
        id: 'rf-m2',
        title: 'Efeitos e hooks',
        lessons: [
          { id: 'rf-m2-l0', title: 'useEffect na prática', duration: '20min', type: 'video', done: true },
          { id: 'rf-m2-l1', title: 'Custom hooks', duration: '15min', type: 'video', done: true },
          { id: 'rf-m2-l2', title: 'Leitura: Regras dos hooks', duration: '06min', type: 'doc', done: true },
          { id: 'rf-m2-l3', title: 'Exercício: useFetch', duration: '40min', type: 'code', done: true },
        ],
      },
      {
        id: 'rf-m3',
        title: 'Context e composição',
        current: true,
        lessons: [
          { id: 'rf-m3-l0', title: 'Por que Context?', duration: '09min', type: 'video', done: true },
          { id: 'rf-m3-l1', title: 'Context API e useContext', duration: '24min', type: 'video', done: true, current: true },
          { id: 'rf-m3-l2', title: 'Patterns: Provider composto', duration: '18min', type: 'video', done: false },
          { id: 'rf-m3-l3', title: 'Exercício: Theme switcher', duration: '35min', type: 'code', done: false },
        ],
      },
      {
        id: 'rf-m4',
        title: 'Performance',
        locked: true,
        lessons: [
          { id: 'rf-m4-l0', title: 'useMemo e useCallback', duration: '22min', type: 'video', done: false },
          { id: 'rf-m4-l1', title: 'React.memo', duration: '12min', type: 'video', done: false },
          { id: 'rf-m4-l2', title: 'Profiling com DevTools', duration: '25min', type: 'video', done: false },
          { id: 'rf-m4-l3', title: 'Exercício: Otimizando lista', duration: '40min', type: 'code', done: false },
        ],
      },
      {
        id: 'rf-m5',
        title: 'Projeto final',
        locked: true,
        lessons: [
          { id: 'rf-m5-l0', title: 'Briefing do projeto', duration: '10min', type: 'doc', done: false },
          { id: 'rf-m5-l1', title: 'Build: App de tarefas v2', duration: '3h', type: 'code', done: false },
          { id: 'rf-m5-l2', title: 'Code review gravado', duration: '45min', type: 'video', done: false },
          { id: 'rf-m5-l3', title: 'Entrega e feedback', duration: '-', type: 'doc', done: false },
        ],
      },
    ],
  },
  {
    id: 'advanced-nextjs',
    title: 'Advanced Next.js',
    subtitle: 'App Router, Server Components, streaming e performance de produção',
    color: '#A78BFA',
    progress: 12,
    hoursTotal: 22,
    hoursDone: 2.6,
    lessonsTotal: 28,
    lessonsDone: 4,
    level: 'Intermediário → Avançado',
    nextLesson: 'Server Actions e mutations',
    aiNote: 'Sugiro revisar RSC antes de continuar.',
    modules: [
      {
        id: 'an-m0',
        title: 'Foundations revisitado',
        lessons: [
          { id: 'an-m0-l0', title: 'Do Pages Router ao App Router', duration: '16min', type: 'video', done: true },
          { id: 'an-m0-l1', title: 'File-system routing avançado', duration: '20min', type: 'video', done: true },
          { id: 'an-m0-l2', title: 'Layouts, loading, error', duration: '18min', type: 'video', done: true },
          { id: 'an-m0-l3', title: 'Exercício: dashboard aninhado', duration: '45min', type: 'code', done: true },
        ],
      },
      {
        id: 'an-m1',
        title: 'React Server Components',
        current: true,
        lessons: [
          { id: 'an-m1-l0', title: 'O que muda com RSC', duration: '22min', type: 'video', done: false, current: true },
          { id: 'an-m1-l1', title: 'Client boundaries', duration: '18min', type: 'video', done: false },
          { id: 'an-m1-l2', title: 'Server Actions', duration: '24min', type: 'video', done: false },
          { id: 'an-m1-l3', title: 'Exercício: form com Server Action', duration: '50min', type: 'code', done: false },
        ],
      },
    ],
  },
  {
    id: 'uxui-for-devs',
    title: 'UX/UI for Developers',
    subtitle: 'Princípios de design aplicados ao código — tipografia, ritmo e hierarquia',
    color: '#5EEAD4',
    progress: 34,
    hoursTotal: 14,
    hoursDone: 4.8,
    lessonsTotal: 20,
    lessonsDone: 7,
    level: 'Iniciante',
    nextLesson: 'Escala tipográfica e ritmo vertical',
    aiNote: 'Progresso consistente. Recomendo agendar 2h/semana.',
    modules: [
      {
        id: 'ud-m0',
        title: 'Fundamentos do design',
        lessons: [
          { id: 'ud-m0-l0', title: 'Por que devs precisam pensar design', duration: '11min', type: 'video', done: true },
          { id: 'ud-m0-l1', title: 'Hierarquia visual', duration: '14min', type: 'video', done: true },
          { id: 'ud-m0-l2', title: 'Contraste, cor e acessibilidade', duration: '18min', type: 'video', done: true },
          { id: 'ud-m0-l3', title: 'Exercício: auditar uma UI', duration: '30min', type: 'doc', done: true },
        ],
      },
      {
        id: 'ud-m1',
        title: 'Tipografia',
        current: true,
        lessons: [
          { id: 'ud-m1-l0', title: 'Escala tipográfica e ritmo vertical', duration: '20min', type: 'video', done: false, current: true },
          { id: 'ud-m1-l1', title: 'Pairings e peso visual', duration: '15min', type: 'video', done: false },
        ],
      },
    ],
  },
];
