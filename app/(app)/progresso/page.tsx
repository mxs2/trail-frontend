'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { useStore } from '../../../store/useStore';
import { tokens } from '../../../lib/tokens';

const ACHIEVEMENTS = [
  {
    icon: <SchoolOutlinedIcon sx={{ fontSize: 22 }} />,
    title: 'Primeira trilha',
    desc: 'Iniciou sua primeira trilha',
    unlocked: true,
  },
  {
    icon: <CheckCircleOutlinedIcon sx={{ fontSize: 22 }} />,
    title: '10 aulas',
    desc: 'Concluiu 10 aulas',
    unlocked: true,
  },
  {
    icon: <LocalFireDepartmentOutlinedIcon sx={{ fontSize: 22 }} />,
    title: '7 dias seguidos',
    desc: 'Estudou 7 dias consecutivos',
    unlocked: false,
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 22 }} />,
    title: 'Primeira IA aceita',
    desc: 'Aceitou sugestão do Tutor IA',
    unlocked: false,
  },
];

export default function ProgressoPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const trails = useStore((s) => s.trails);

  const totalHours = trails.reduce((a, t) => a + t.hoursDone, 0).toFixed(1);
  const totalLessons = trails.reduce((a, t) => a + t.lessonsDone, 0);
  const activeTrails = trails.filter((t) => t.progress > 0 && t.progress < 100);

  const STATS = [
    {
      label: 'Horas totais',
      value: `${totalHours}h`,
      icon: <AccessTimeOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    {
      label: 'Aulas concluídas',
      value: String(totalLessons),
      icon: <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    {
      label: 'Sequência',
      value: '7 dias',
      icon: <LocalFireDepartmentOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    {
      label: 'Nível',
      value: user ? `Nível ${user.level}` : '—',
      icon: <EmojiEventsOutlinedIcon sx={{ fontSize: 18 }} />,
    },
  ];

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
          Seu progresso
        </Typography>
        <Typography sx={{ color: tokens.text[2], fontSize: '0.875rem' }}>
          Acompanhe sua evolução nas trilhas
        </Typography>
      </Box>

      {/* Stat cards */}
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
            <Typography sx={{ fontFamily: 'var(--f-serif)', fontSize: 28, lineHeight: 1, mb: 0.5 }}>
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

      {/* Trilhas em andamento */}
      <Box>
        <Typography sx={{ fontFamily: 'var(--f-serif)', fontSize: 20, mb: 1.75 }}>
          Trilhas em andamento
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {(activeTrails.length > 0 ? activeTrails : trails).map((trail) => (
            <Box
              key={trail.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                bgcolor: tokens.bg[3],
                border: `1px solid ${tokens.line.default}`,
                borderRadius: '14px',
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  bgcolor: `${trail.color}20`,
                  border: `1px solid ${trail.color}40`,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: trail.color }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      mr: 2,
                    }}
                  >
                    {trail.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: tokens.text[2],
                      flexShrink: 0,
                      fontFamily: 'var(--f-mono)',
                    }}
                  >
                    {trail.progress}%
                  </Typography>
                </Box>
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
                <Typography sx={{ fontSize: 11, color: tokens.text[2], mt: 0.75 }}>
                  {trail.lessonsDone} de {trail.lessonsTotal} aulas · {trail.hoursDone}h /{' '}
                  {trail.hoursTotal}h
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                endIcon={<ArrowForwardIcon sx={{ fontSize: '12px !important' }} />}
                onClick={() => router.push(`/trilha/${trail.id}`)}
                sx={{
                  flexShrink: 0,
                  fontSize: 12,
                  textTransform: 'none',
                  borderColor: tokens.line.default,
                  color: tokens.text[2],
                  '&:hover': { borderColor: tokens.line.strong, bgcolor: tokens.bg[4] },
                }}
              >
                Continuar
              </Button>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Conquistas */}
      <Box>
        <Typography sx={{ fontFamily: 'var(--f-serif)', fontSize: 20, mb: 1.75 }}>
          Conquistas
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 1.5,
          }}
        >
          {ACHIEVEMENTS.map((a) => (
            <Box
              key={a.title}
              sx={{
                p: 2.5,
                bgcolor: tokens.bg[3],
                border: `1px solid ${a.unlocked ? tokens.orange.ring : tokens.line.default}`,
                borderRadius: '14px',
                opacity: a.unlocked ? 1 : 0.4,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  bgcolor: a.unlocked ? tokens.orange.soft : tokens.bg[0],
                  color: a.unlocked ? 'primary.main' : tokens.text[2],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {a.icon}
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{a.title}</Typography>
              <Typography sx={{ fontSize: 11, color: tokens.text[2], lineHeight: 1.4 }}>
                {a.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
