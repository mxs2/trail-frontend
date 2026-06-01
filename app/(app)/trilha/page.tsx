'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '../../../store/useStore';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import { tokens } from '../../../lib/tokens';

export default function MinhasTrilhasPage() {
  const router = useRouter();
  const trails = useStore((s) => s.trails);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box>
        <Typography
          component="h1"
          sx={{
            fontFamily: 'var(--f-serif)',
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            fontWeight: 400,
            lineHeight: 1.15,
            mb: 0.5,
          }}
        >
          Minhas Trilhas
        </Typography>
        <Typography sx={{ color: tokens.text[2], fontSize: '0.875rem' }}>
          {trails.length} trilha{trails.length !== 1 ? 's' : ''} em andamento
        </Typography>
      </Box>

      {/* Trail cards grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {trails.map((trail) => (
          <Box
            key={trail.id}
            onClick={() => router.push(`/trilha/${trail.id}`)}
            sx={{
              p: 3,
              bgcolor: tokens.bg[3],
              border: `1px solid ${tokens.line.default}`,
              borderRadius: '16px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              transition: 'border-color 150ms, background 150ms',
              '&:hover': {
                borderColor: `${trail.color}55`,
                bgcolor: tokens.bg[4],
              },
            }}
          >
            {/* Color badge + level */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  bgcolor: `${trail.color}20`,
                  border: `1px solid ${trail.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ width: 14, height: 14, borderRadius: '3px', bgcolor: trail.color }} />
              </Box>
              <Box
                sx={{
                  px: '8px',
                  py: '3px',
                  borderRadius: '6px',
                  bgcolor: tokens.bg[0],
                  border: `1px solid ${tokens.line.default}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.6875rem',
                    color: tokens.text[2],
                    fontFamily: 'var(--f-mono)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {trail.level}
                </Typography>
              </Box>
            </Box>

            {/* Title & subtitle */}
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '1.0625rem', mb: 0.5 }}>
                {trail.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  color: tokens.text[2],
                  lineHeight: 1.45,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {trail.subtitle}
              </Typography>
            </Box>

            {/* Progress */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography sx={{ fontSize: '0.75rem', color: tokens.text[2] }}>
                  Progresso
                </Typography>
                <Typography
                  sx={{ fontSize: '0.75rem', fontWeight: 600, color: trail.color, fontFamily: 'var(--f-mono)' }}
                >
                  {trail.progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={trail.progress}
                sx={{
                  height: 5,
                  borderRadius: 3,
                  bgcolor: tokens.bg[0],
                  '& .MuiLinearProgress-bar': { bgcolor: trail.color, borderRadius: 3 },
                }}
              />
            </Box>

            {/* Meta row */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pt: 0.5,
                borderTop: `1px solid ${tokens.line.default}`,
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: tokens.text[2] }}>
                  <LayersOutlinedIcon sx={{ fontSize: 13 }} />
                  <Typography sx={{ fontSize: '0.75rem' }}>
                    {trail.lessonsDone}/{trail.lessonsTotal} aulas
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: tokens.text[2] }}>
                  <AccessTimeOutlinedIcon sx={{ fontSize: 13 }} />
                  <Typography sx={{ fontSize: '0.75rem' }}>
                    {trail.hoursDone}h/{trail.hoursTotal}h
                  </Typography>
                </Box>
              </Box>
              <Button
                size="small"
                variant="text"
                endIcon={<ArrowForwardIcon sx={{ fontSize: '11px !important' }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/trilha/${trail.id}`);
                }}
                sx={{
                  fontSize: '0.75rem',
                  color: trail.color,
                  textTransform: 'none',
                  p: 0,
                  minWidth: 0,
                  '&:hover': { bgcolor: 'transparent', opacity: 0.8 },
                }}
              >
                Continuar
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
