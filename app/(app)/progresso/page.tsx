'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import { useStore } from '../../../store/useStore';
import { api } from '../../../services/api';
import type { WeeklyActivity } from '../../../types';
import { tokens } from '../../../lib/tokens';

// ── Streak helper — shared logic with dashboard ───────────────────────────────

const PT_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function computeStreak(activity: WeeklyActivity[]): number {
  const todayPt = PT_DAYS[new Date().getDay()];
  const todayIdx = activity.findIndex((d) => d.day === todayPt);
  let streak = 0;
  if (todayIdx >= 0) {
    for (let i = todayIdx; i >= 0; i--) {
      if (activity[i].mins > 0) streak++;
      else break;
    }
  }
  return streak;
}

// ── Achievement definitions — computed from real data ─────────────────────────

function buildAchievements(totalApproved: number, trailCount: number, streak: number) {
  return [
    {
      icon: <SchoolOutlinedIcon sx={{ fontSize: 22 }} />,
      title: 'Primeira trilha',
      desc: 'Iniciou sua primeira trilha',
      unlocked: trailCount >= 1,
    },
    {
      icon: <AssignmentTurnedInOutlinedIcon sx={{ fontSize: 22 }} />,
      title: 'Primeiro desafio',
      desc: 'Teve um desafio aprovado',
      unlocked: totalApproved >= 1,
    },
    {
      icon: <CheckCircleOutlinedIcon sx={{ fontSize: 22 }} />,
      title: '5 desafios',
      desc: 'Teve 5 desafios aprovados',
      unlocked: totalApproved >= 5,
    },
    {
      icon: <LocalFireDepartmentOutlinedIcon sx={{ fontSize: 22 }} />,
      title: '7 dias seguidos',
      desc: 'Estudou 7 dias consecutivos',
      unlocked: streak >= 7,
    },
  ];
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProgressoPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const trails = useStore((s) => s.trails);

  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch weekly activity for streak computation
    api
      .getWeeklyActivity()
      .then(setWeeklyActivity)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Real progress values from store (updated by updateTrailProgress when visiting a trail)
  const totalApproved = trails.reduce((a, t) => a + t.lessonsDone, 0);
  const totalHours = trails.reduce((a, t) => a + t.hoursDone, 0).toFixed(1);
  const streak = computeStreak(weeklyActivity);
  const streakLabel = loading ? '…' : streak > 0 ? `${streak} dia${streak !== 1 ? 's' : ''}` : '—';

  // Separate trails by status
  const inProgress = trails.filter((t) => t.lessonsTotal > 0 && t.progress > 0 && t.progress < 100);
  const completed = trails.filter((t) => t.lessonsTotal > 0 && t.progress === 100);
  const notStarted = trails.filter((t) => t.lessonsTotal === 0 || t.progress === 0);

  const STATS = [
    {
      label: 'Desafios aprovados',
      value: String(totalApproved),
      icon: <AssignmentTurnedInOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    {
      label: 'Horas estimadas',
      value: `${totalHours}h`,
      icon: <LayersOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    {
      label: 'Sequência',
      value: streakLabel,
      icon: <LocalFireDepartmentOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    {
      label: 'Nível',
      value: user ? `Nível ${user.level}` : '—',
      icon: <EmojiEventsOutlinedIcon sx={{ fontSize: 18 }} />,
    },
  ];

  const achievements = buildAchievements(totalApproved, trails.length, streak);

  // ── Trail row component ─────────────────────────────────────────────────────

  function TrailRow({ trail, cta }: { trail: (typeof trails)[0]; cta: string }) {
    return (
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 0.75,
            }}
          >
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
                color: trail.progress === 100 ? 'primary.main' : tokens.text[2],
                flexShrink: 0,
                fontFamily: 'var(--f-mono)',
                fontWeight: trail.progress === 100 ? 700 : 400,
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
            {trail.lessonsDone} de {trail.lessonsTotal} desafios · {trail.hoursTotal}h estimadas
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
          {cta}
        </Button>
      </Box>
    );
  }

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
              {loading && s.label === 'Sequência' ? <CircularProgress size={20} /> : s.value}
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
      {inProgress.length > 0 && (
        <Box>
          <Typography sx={{ fontFamily: 'var(--f-serif)', fontSize: 20, mb: 1.75 }}>
            Em andamento
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {inProgress.map((t) => (
              <TrailRow key={t.id} trail={t} cta="Continuar" />
            ))}
          </Box>
        </Box>
      )}

      {/* Trilhas concluídas */}
      {completed.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.75 }}>
            <Typography sx={{ fontFamily: 'var(--f-serif)', fontSize: 20 }}>Concluídas</Typography>
            <Chip
              label={completed.length}
              size="small"
              sx={{
                bgcolor: tokens.orange.soft,
                border: `1px solid ${tokens.orange.ring}`,
                color: 'primary.main',
                fontFamily: 'var(--f-mono)',
                fontWeight: 700,
                height: 20,
                fontSize: '0.6875rem',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {completed.map((t) => (
              <TrailRow key={t.id} trail={t} cta="Revisar" />
            ))}
          </Box>
        </Box>
      )}

      {/* Not started — only show if there's nothing in progress/completed */}
      {inProgress.length === 0 && completed.length === 0 && notStarted.length > 0 && (
        <Box>
          <Typography sx={{ fontFamily: 'var(--f-serif)', fontSize: 20, mb: 1.75 }}>
            Trilhas disponíveis
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {notStarted.map((t) => (
              <TrailRow key={t.id} trail={t} cta="Começar" />
            ))}
          </Box>
        </Box>
      )}

      {/* Empty state — no trails at all */}
      {trails.length === 0 && (
        <Box
          sx={{
            py: 5,
            textAlign: 'center',
            bgcolor: tokens.bg[3],
            border: `1px solid ${tokens.line.default}`,
            borderRadius: '14px',
          }}
        >
          <SchoolOutlinedIcon sx={{ fontSize: 36, color: tokens.text[3], mb: 1 }} />
          <Typography sx={{ color: tokens.text[2] }}>Nenhuma trilha iniciada ainda.</Typography>
        </Box>
      )}

      {/* Conquistas — computed from real data, no vaporware */}
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
          {achievements.map((a) => (
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
