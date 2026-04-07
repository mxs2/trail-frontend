'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Avanade brand colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#D8005A', // Avanade Magenta/Pink
      light: '#E6397A',
      dark: '#A60045',
      contrastText: '#FFF',
    },
    secondary: {
      main: '#FF5C35', // Avanade Orange
      light: '#FF8A6B',
      dark: '#D03E19',
      contrastText: '#FFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2b2b2b',
      secondary: '#4A3B59',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      borderRadius: 24, // Pill shape like the Avanade site
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: 'none',
          '&:active': {
            boxShadow: 'none',
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
