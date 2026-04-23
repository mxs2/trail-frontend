import { createTheme } from '@mui/material/styles';
import { tokens } from './tokens';

// Dark-first theme. Light theme support is out of scope for MVP.
// Official Avanade brand color: #FF6200. Prototype used #FF6B2B — official wins.

// Re-export so callers that already import from lib/theme keep working.
export { tokens };

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6200',
      light: '#FF7A1F',
      dark: '#E55A00',
      contrastText: '#F5F1EA',
    },
    secondary: {
      main: '#A78BFA', // violet — AI accent
      light: '#C4B5FD',
      dark: '#7C5CFA',
      contrastText: '#F5F1EA',
    },
    background: {
      default: '#0E1524', // --bg-1
      paper: '#131B2E', // --bg-2
    },
    text: {
      primary: '#F5F1EA', // --text-0
      secondary: '#C8CEDB', // --text-1
      disabled: '#8B96A8', // --text-2
    },
    divider: 'rgba(255,255,255,0.07)',
    success: { main: '#5EEAD4', contrastText: '#0B1220' },
    warning: { main: '#FBBF24', contrastText: '#0B1220' },
    error: { main: '#F87171', contrastText: '#F5F1EA' },
  },

  typography: {
    // Inter injected as CSS var by next/font in lib/fonts.ts
    fontFamily: 'var(--f-sans)',
    h1: { fontWeight: 700, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.03em' },
    h3: { fontWeight: 600, letterSpacing: '-0.02em' },
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.5 },
    // caption doubles as mono label (JetBrains Mono via --f-mono)
    caption: {
      fontFamily: 'var(--f-mono)',
      fontSize: '0.6875rem',
      letterSpacing: '0.08em',
    },
    button: { textTransform: 'none', fontWeight: 600 },
  },

  shape: { borderRadius: 8 }, // --r-sm base; components override as needed

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent',
          '&::-webkit-scrollbar': { width: 10, height: 10 },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 999,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255,255,255,0.16)',
          },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
        },
        '*:focus-visible': {
          outline: '2px solid #FF6200',
          outlineOffset: '2px',
          borderRadius: '6px',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          boxShadow: 'none',
          transition: 'background 120ms, color 120ms, border-color 120ms',
          '&:hover': { boxShadow: 'none' },
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.12)',
          color: '#C8CEDB',
          '&:hover': {
            background: 'rgba(255,255,255,0.05)',
            borderColor: 'rgba(255,255,255,0.2)',
          },
        },
        text: {
          color: '#C8CEDB',
          '&:hover': {
            background: 'rgba(255,255,255,0.05)',
            color: '#F5F1EA',
          },
        },
      },
      // variant + color combos require the `variants` API in MUI v9
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: '#FF6200',
            '&:hover': { background: '#FF7A1F' },
            '&:active': { background: '#E55A00' },
          },
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            borderColor: 'rgba(255,98,0,0.35)',
            color: '#FF6200',
            '&:hover': {
              background: 'rgba(255,98,0,0.08)',
              borderColor: '#FF6200',
            },
          },
        },
      ],
    },

    MuiCard: {
      styleOverrides: {
        root: {
          background: '#131B2E',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12, // --r-md
          boxShadow: 'none',
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 20,
          '&:last-child': { paddingBottom: 20 },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: '#131B2E',
            borderRadius: 8,
            '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
            '&.Mui-focused fieldset': { borderColor: '#FF6200' },
          },
          '& .MuiInputLabel-root': { color: '#8B96A8' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#FF6200' },
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 4,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.08)',
        },
        bar: { borderRadius: 999 },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 24,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.07)' },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#222C44',
          color: '#F5F1EA',
          fontSize: '0.75rem',
          borderRadius: 6,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#0E1524',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;
