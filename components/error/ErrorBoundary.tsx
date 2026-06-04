'use client';

import { Component, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import { tokens } from '../../lib/tokens';

interface Props {
  children: ReactNode;
  /** Custom fallback UI. Receives the caught error. */
  fallback?: (error: Error | null, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React class-based Error Boundary.
 *
 * Wrap page content or layout segments to prevent a single component crash
 * from blanking the entire screen. Logs to console so errors remain visible
 * during development; a real app would pipe to Sentry here.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomePageThatMightThrow />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // TODO: send to Sentry / observability platform in production
    console.error('[ErrorBoundary]', error.message, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) {
      return this.props.fallback(this.state.error, this.reset);
    }

    return <DefaultError error={this.state.error} onReset={this.reset} />;
  }
}

// ── Default fallback UI ───────────────────────────────────────────────────────

function DefaultError({ error, onReset }: { error: Error | null; onReset: () => void }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
        gap: 2,
        p: 4,
        textAlign: 'center',
      }}
    >
      <Typography
        sx={{
          fontFamily: 'var(--f-serif)',
          fontSize: '1.5rem',
          fontWeight: 400,
          mb: 0.5,
        }}
      >
        Algo deu errado
      </Typography>

      {error && (
        <Box
          sx={{
            px: 2,
            py: 1,
            borderRadius: '8px',
            bgcolor: tokens.bg[3],
            border: `1px solid ${tokens.line.default}`,
            maxWidth: 480,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.8125rem',
              color: tokens.text[2],
              fontFamily: 'var(--f-mono)',
              wordBreak: 'break-all',
            }}
          >
            {error.message}
          </Typography>
        </Box>
      )}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RefreshIcon />}
        onClick={onReset}
        sx={{
          textTransform: 'none',
          borderRadius: '8px',
          borderColor: tokens.line.strong,
          color: tokens.text[2],
          '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
        }}
      >
        Tentar novamente
      </Button>
    </Box>
  );
}
