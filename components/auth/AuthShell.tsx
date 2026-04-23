'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckIcon from '@mui/icons-material/Check';
import Logo from '../ui/Logo';
import { tokens } from '../../lib/tokens';

const FEATURES = [
  { title: 'Trilhas personalizadas', desc: 'Montadas pela IA com base em seus objetivos' },
  { title: 'Mentores humanos', desc: 'Acompanhamento real, não só automático' },
  { title: 'Adapta em tempo real', desc: 'Se você trava, a trilha ajusta' },
];

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: { xs: 'flex', md: 'grid' },
        flexDirection: { xs: 'column', md: undefined },
        gridTemplateColumns: { md: '1fr 1fr' },
        bgcolor: 'background.default',
      }}
    >
      {/* Left: form area */}
      <Box
        sx={{
          px: { xs: 3, sm: 5, md: 8 },
          py: 5,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <Box
          component={Link}
          href="/"
          sx={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
        >
          <Logo />
        </Box>

        {/* Form content — vertically centered */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: 400,
            mx: 'auto',
            width: '100%',
            py: 6,
          }}
        >
          {children}
        </Box>

        {/* Copyright */}
        <Typography
          variant="caption"
          sx={{ color: tokens.text[3], fontFamily: 'var(--f-sans)', fontSize: '0.75rem' }}
        >
          © 2026 Trail
        </Typography>
      </Box>

      {/* Right: feature panel — hidden on mobile */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          px: 8,
          py: 8,
          bgcolor: tokens.bg[0],
          borderLeft: `1px solid ${tokens.line.default}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative orange radial blob */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,98,0,0.12), transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <Box sx={{ position: 'relative' }}>
          {/* Eyebrow */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.25 }}>
            <AutoAwesomeIcon sx={{ fontSize: 11, color: 'primary.main' }} />
            <Typography
              variant="caption"
              sx={{ color: 'primary.main', letterSpacing: '0.12em', fontSize: '0.6875rem' }}
            >
              O QUE TE ESPERA
            </Typography>
          </Box>

          {/* Heading */}
          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--f-serif)',
              fontSize: { md: '2rem', lg: '2.5rem' },
              fontWeight: 400,
              lineHeight: 1.1,
              mb: 4,
            }}
          >
            Uma trilha que{' '}
            <Box component="em" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
              adapta‑se
            </Box>{' '}
            enquanto você estuda.
          </Typography>

          {/* Feature cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {FEATURES.map((f) => (
              <Box
                key={f.title}
                sx={{
                  display: 'flex',
                  gap: 1.75,
                  p: 2,
                  bgcolor: 'background.paper',
                  border: `1px solid ${tokens.line.default}`,
                  borderRadius: '12px',
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: tokens.orange.soft,
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CheckIcon sx={{ fontSize: 15 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{f.title}</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: tokens.text[2], mt: '2px' }}>
                    {f.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
