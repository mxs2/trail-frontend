'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '../../../store/useStore';
import { WEEKLY_ACTIVITY } from '../../../mocks/activity';
import { tokens } from '../../../lib/tokens';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';


const MAX_MINS = Math.max(...WEEKLY_ACTIVITY.map((d) => d.mins));

export default function DashboardPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const trails = useStore((s) => s.trails);

  const firstName = user?.name?.split(' ')[0] ?? 'Aluno';
  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const totalHours = trails.reduce((a, t) => a + t.hoursDone, 0).toFixed(1);
  const totalLessons = trails.reduce((a, t) => a + t.lessonsDone, 0);

  const STATS = [
    {
      label: 'Horas estudadas',
      value: `${totalHours}h`,
      icon: <AccessTimeOutlinedIcon sx={{ fontSize: 16 }} />,
    },
    {
      label: 'Aulas concluídas',
      value: String(totalLessons),
      icon: <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />,
    },
    {
      label: 'Sequência',
      value: '12 dias',
      icon: <LocalFireDepartmentOutlinedIcon sx={{ fontSize: 16 }} />,
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Header */}
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: 'primary.main',
            letterSpacing: '0.12em',
            display: 'block',
            mb: 0.5,
            textTransform: 'capitalize',
          }}
        >
          {dateStr}
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontFamily: 'var(--f-serif)',
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            fontWeight: 400,
            lineHeight: 1.15,
          }}
        >
          Olá, {firstName}.
        </Typography>
      </Box>

      {/* Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 1.75,
        }}
      >
        {STATS.map((s) => (
          <Box
            key={s.label}
            sx={{
              p: 2.5,
              bgcolor: tokens.bg[3],
              border: `1px solid ${tokens.line.default}`,
              borderRadius: '14px',
            }}
          >
            <Box sx={{ color: tokens.text[2], mb: 1 }}>{s.icon}</Box>
            <Typography sx={{ fontFamily: 'var(--f-serif)', fontSize: 26, lineHeight: 1, mb: 0.5 }}>
              {s.value}
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                color: tokens.text[2],
                fontFamily: 'var(--f-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
              }}
            >
              {s.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Trails + Activity */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.5fr 1fr' }, gap: 2.5 }}>

        {/* All trails */}
        <Box
          sx={{
            p: 3,
            bgcolor: tokens.bg[3],
            border: `1px solid ${tokens.line.default}`,
            borderRadius: '16px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>Em andamento</Typography>
            <Typography
              onClick={() => router.push('/trilha')}
              sx={{ fontSize: '0.75rem', color: 'primary.main', cursor: 'pointer' }}
            >
              Ver todas
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {trails.map((trail) => (
              <Box key={trail.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.25 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '10px',
                      bgcolor: `${trail.color}20`,
                      border: `1px solid ${trail.color}44`,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box sx={{ width: 11, height: 11, borderRadius: '2px', bgcolor: trail.color }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          mr: 1,
                        }}
                      >
                        {trail.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          color: trail.color,
                          fontFamily: 'var(--f-mono)',
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {trail.progress}%
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', color: tokens.text[2], mb: 0.75 }}>
                      {trail.nextLesson}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={trail.progress}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: tokens.bg[0],
                        '& .MuiLinearProgress-bar': { bgcolor: trail.color, borderRadius: 2 },
                      }}
                    />
                  </Box>
                  <Button
                    size="small"
                    variant="text"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: '10px !important' }} />}
                    onClick={() => router.push(`/trilha/${trail.id}`)}
                    sx={{
                      flexShrink: 0,
                      fontSize: '0.75rem',
                      color: tokens.text[2],
                      textTransform: 'none',
                      px: 1,
                      '&:hover': { color: 'text.primary', bgcolor: tokens.bg[4] },
                    }}
                  >
                    Abrir
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Activity chart */}
        <Box
          sx={{
            p: 3,
            bgcolor: tokens.bg[3],
            border: `1px solid ${tokens.line.default}`,
            borderRadius: '16px',
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', mb: 0.5 }}>
            Atividade semanal
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: tokens.text[2], mb: 3 }}>
            Minutos estudados por dia
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 90 }}>
            {WEEKLY_ACTIVITY.map((d) => {
              const pct = MAX_MINS > 0 ? (d.mins / MAX_MINS) * 100 : 0;
              const isToday = d.day === 'Qui';
              return (
                <Box
                  key={d.day}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.75,
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Box
                    title={`${d.day}: ${d.mins}min`}
                    sx={{
                      width: '100%',
                      height: pct > 0 ? `${pct}%` : '3px',
                      bgcolor: isToday
                        ? 'primary.main'
                        : d.mins > 0
                          ? tokens.line.strong
                          : tokens.line.default,
                      borderRadius: '4px 4px 2px 2px',
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '0.625rem',
                      color: isToday ? 'primary.main' : tokens.text[3],
                      fontFamily: 'var(--f-mono)',
                    }}
                  >
                    {d.day}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
