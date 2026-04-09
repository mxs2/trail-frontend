'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Avanade brand colors and typography
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6200', // Avanade Orange as primary instead of magenta
      light: '#FF8A6B',
      dark: '#cc5200',
      contrastText: '#FFF',
    },
    secondary: {
      main: '#1E2738', // Dark Navy for contrasting elements
      light: '#2A364F',
      dark: '#131b28',
      contrastText: '#FFF',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E2738',
      secondary: '#4A3B59',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontWeight: 800, letterSpacing: '-0.03em' },
    h3: { fontWeight: 800, letterSpacing: '-0.02em' },
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24, // Pill shape like the Avanade site
          boxShadow: 'none',
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E2738',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Sharp geometric forms for cards
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid #E0E0E0',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
          },
        },
      },
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
