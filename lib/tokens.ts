// Design tokens that live outside MUI's palette.
// Importable in both Server and Client components without pulling in createTheme.

export const tokens = {
  bg: {
    0: '#0B1220', // sidebar / deepest surface
    3: '#1A2236', // raised cards / hover state
    4: '#222C44', // interactive hover
  },
  line: {
    default: 'rgba(255,255,255,0.07)',
    strong: 'rgba(255,255,255,0.12)',
  },
  text: {
    2: '#8B96A8', // muted
    3: '#5B6578', // faint
  },
  orange: {
    soft: 'rgba(255,98,0,0.14)',
    ring: 'rgba(255,98,0,0.35)',
  },
  violet: {
    main: '#A78BFA',
    soft: 'rgba(167,139,250,0.12)',
    ring: 'rgba(167,139,250,0.30)',
  },
  success: {
    soft: 'rgba(94,234,212,0.12)',
  },
} as const;
