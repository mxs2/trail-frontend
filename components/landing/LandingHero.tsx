'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { tokens } from '../../lib/tokens';

const METRICS = [
  { value: '3.2k+', label: 'trilhas personalizadas geradas' },
  { value: '87%', label: 'dos alunos completam mais de 1 módulo/semana' },
  { value: '4.9★', label: 'avaliação média dos mentores' },
];

export default function LandingHero() {
  return (
    <Box
      component="section"
      sx={{
        px: { xs: 3, md: 6 },
        pt: { xs: '60px', md: '100px' },
        pb: { xs: '60px', md: '80px' },
        maxWidth: 1200,
        mx: 'auto',
        position: 'relative',
      }}
    >
      {/* Eyebrow */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          mb: 2.5,
          fontFamily: 'var(--f-mono)',
          fontSize: 12,
          color: 'primary.main',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        <AutoAwesomeIcon sx={{ fontSize: 11 }} />
        Trilhas de estudo com IA
      </Box>

      {/* H1 */}
      <Typography
        component="h1"
        sx={{
          fontFamily: 'var(--f-serif)',
          fontWeight: 400,
          fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5.25rem' },
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          mb: { xs: '28px', md: '44px' },
          maxWidth: 900,
          color: 'text.primary',
        }}
      >
        Aprender devia ser{' '}
        <Box component="em" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
          seu caminho
        </Box>
        , não o roadmap de outra pessoa.
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{
          fontSize: { xs: 16, md: 19 },
          color: 'text.secondary',
          maxWidth: 620,
          lineHeight: 1.55,
          mb: 5,
        }}
      >
        Trail gera uma trilha única a partir dos seus objetivos, tempo disponível e nível atual —
        e adapta em tempo real conforme você avança. Acompanhada por mentores humanos, não só por um bot.
      </Typography>

      {/* CTAs */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.75,
          alignItems: 'center',
          mb: { xs: '40px', md: '60px' },
          flexWrap: 'wrap',
        }}
      >
        <Button
          component={Link}
          href="/signup"
          variant="contained"
          size="large"
          endIcon={<ArrowForwardIcon />}
        >
          Começar trilha grátis
        </Button>
        <Button
          variant="text"
          size="large"
          startIcon={<PlayArrowIcon />}
          sx={{ color: 'text.secondary' }}
        >
          Ver demo · 2min
        </Button>
      </Box>

      {/* Metric strip */}
      <Box
        sx={{
          display: { xs: 'grid', sm: 'flex' },
          gridTemplateColumns: { xs: 'repeat(2, 1fr)' },
          gap: { xs: 4, md: 7.5 },
          pt: 5,
          borderTop: `1px solid ${tokens.line.default}`,
        }}
      >
        {METRICS.map((m) => (
          <Box key={m.value}>
            <Typography
              sx={{
                fontFamily: 'var(--f-serif)',
                fontSize: { xs: '2rem', md: '2.75rem' },
                color: 'primary.main',
                lineHeight: 1,
              }}
            >
              {m.value}
            </Typography>
            <Typography
              sx={{
                fontSize: 13,
                color: tokens.text[2],
                mt: 1,
                maxWidth: 240,
                lineHeight: 1.5,
              }}
            >
              {m.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Ambient radial gradients — decorative */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: 60,
          right: { xs: -60, md: -100 },
          width: { xs: 300, md: 500 },
          height: { xs: 300, md: 500 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,98,0,0.1) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: 300,
          right: { xs: 20, md: 100 },
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
    </Box>
  );
}
