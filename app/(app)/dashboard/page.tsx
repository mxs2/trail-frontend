'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../store/useStore';
import { api } from '../../../services/api';
import type { WeeklyActivity } from '../../../types';
import { tokens } from '../../../lib/tokens';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';

const PT_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// ─── Role-specific accent colours ────────────────────────────────────────────

const ROLE_ACCENT: Record<string, string> = {
  admin: '#FF6200',
  mentor: '#A78BFA',
  aluno: '#5EEAD4',
};

const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrador',
  mentor: 'Mentor',
  aluno: 'Aluno',
};

// ─── Sub-sections ─────────────────────────────────────────────────────────────

function AdminSection({
  trailCount,
  totalChallenges,
  router,
}: {
  trailCount: number;
  totalChallenges: number;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Console banner */}
      <Box
        sx={{
          p: 3,
          bgcolor: `${tokens.orange.soft}`,
          border: `1px solid ${tokens.orange.ring}`,
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            bgcolor: `${ROLE_ACCENT.admin}22`,
            border: `1px solid ${ROLE_ACCENT.admin}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: ROLE_ACCENT.admin,
            flexShrink: 0,
          }}
        >
          <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 22 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{ fontWeight: 700, fontSize: '1rem', color: ROLE_ACCENT.admin, mb: 0.25 }}
          >
            Console de Administração
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: tokens.text[2] }}>
            {trailCount} trilha{trailCount !== 1 ? 's' : ''} cadastrada{trailCount !== 1 ? 's' : ''}
            . Crie, edite e publique conteúdo.
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          endIcon={<ArrowForwardIcon sx={{ fontSize: '12px !important' }} />}
          onClick={() => router.push('/admin/trails')}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            flexShrink: 0,
            bgcolor: ROLE_ACCENT.admin,
            '&:hover': { bgcolor: ROLE_ACCENT.admin, filter: 'brightness(0.9)' },
          }}
        >
          Gerenciar
        </Button>
      </Box>

      {/* Quick stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
        {[
          { label: 'Trilhas', value: String(trailCount), Icon: LayersOutlinedIcon },
          { label: 'Desafios', value: String(totalChallenges), Icon: CheckCircleOutlinedIcon },
          {
            label: 'Média / trilha',
            value: trailCount > 0 ? (totalChallenges / trailCount).toFixed(1) : '—',
            Icon: AdminPanelSettingsOutlinedIcon,
          },
        ].map((s) => (
          <Box
            key={s.label}
            sx={{
              p: 2,
              bgcolor: tokens.bg[3],
              border: `1px solid ${tokens.line.default}`,
              borderRadius: '12px',
            }}
          >
            <Box sx={{ color: tokens.text[2], mb: 0.75 }}>
              <s.Icon sx={{ fontSize: 15 }} />
            </Box>
            <Typography
              sx={{ fontFamily: 'var(--f-serif)', fontSize: 22, lineHeight: 1, mb: 0.25 }}
            >
              {s.value}
            </Typography>
            <Typography
              sx={{
                fontSize: 10,
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
    </Box>
  );
}

function MentorSection() {
  const router = useRouter();
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getPendingCount()
      .then(setPending)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: tokens.bg[3],
        border: `1px solid ${ROLE_ACCENT.mentor}55`,
        borderRadius: '16px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            bgcolor: `${ROLE_ACCENT.mentor}22`,
            border: `1px solid ${ROLE_ACCENT.mentor}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: ROLE_ACCENT.mentor,
          }}
        >
          <AssignmentOutlinedIcon sx={{ fontSize: 18 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
            Submissões Pendentes
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: tokens.text[2] }}>
            Aguardando revisão
          </Typography>
        </Box>
        {!loading && (
          <Chip
            label={pending}
            size="small"
            sx={{
              ml: 'auto',
              bgcolor: `${ROLE_ACCENT.mentor}22`,
              color: ROLE_ACCENT.mentor,
              border: `1px solid ${ROLE_ACCENT.mentor}55`,
              fontFamily: 'var(--f-mono)',
              fontWeight: 700,
            }}
          />
        )}
      </Box>

      {loading ? (
        <Typography sx={{ color: tokens.text[2], fontSize: '0.875rem' }}>Carregando…</Typography>
      ) : pending === 0 ? (
        <Box sx={{ py: 2, textAlign: 'center' }}>
          <CheckCircleOutlinedIcon sx={{ fontSize: 32, color: tokens.text[3], mb: 1 }} />
          <Typography sx={{ color: tokens.text[2], fontSize: '0.875rem' }}>
            Nenhuma submissão pendente. Tudo em dia!
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              sx={{
                fontFamily: 'var(--f-mono)',
                fontWeight: 700,
                fontSize: '2rem',
                color: ROLE_ACCENT.mentor,
              }}
            >
              {pending}
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: tokens.text[2] }}>
              entrega{pending !== 1 ? 's' : ''} aguardando revisão
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            endIcon={<ArrowForwardIcon sx={{ fontSize: '12px !important' }} />}
            onClick={() => router.push('/mentor/queue')}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              bgcolor: ROLE_ACCENT.mentor,
              '&:hover': { bgcolor: ROLE_ACCENT.mentor, filter: 'brightness(0.88)' },
            }}
          >
            Abrir fila
          </Button>
        </Box>
      )}
    </Box>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const trails = useStore((s) => s.trails);
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);

  useEffect(() => {
    api
      .getWeeklyActivity()
      .then(setWeeklyActivity)
      .catch(() => {});
  }, []);

  const todayPt = PT_DAYS[new Date().getDay()];
  const maxMins = weeklyActivity.reduce((m, d) => Math.max(m, d.mins), 0);
  const isAdmin = user?.role === 'admin';
  const isMentor = user?.role === 'mentor';
  const isStudent = user?.role === 'aluno';

  const firstName = user?.name?.split(' ')[0] ?? 'Aluno';
  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const roleAccent = user ? (ROLE_ACCENT[user.role] ?? tokens.text[2]) : tokens.text[2];

  const totalHours = trails.reduce((a, t) => a + t.hoursDone, 0).toFixed(1);
  const totalLessons = trails.reduce((a, t) => a + t.lessonsDone, 0);

  // Compute streak from actual weekly activity — count consecutive active days
  // ending today. Max 7 since that's all the data we have.
  const todayIdx = weeklyActivity.findIndex((d) => d.day === todayPt);
  let streakDays = 0;
  if (todayIdx >= 0) {
    for (let i = todayIdx; i >= 0; i--) {
      if (weeklyActivity[i].mins > 0) streakDays++;
      else break;
    }
  }
  const streakLabel = streakDays > 0 ? `${streakDays} dia${streakDays !== 1 ? 's' : ''}` : '—';

  const STATS = [
    { label: 'Horas estudadas', value: `${totalHours}h`, Icon: AccessTimeOutlinedIcon },
    { label: 'Desafios aprovados', value: String(totalLessons), Icon: CheckCircleOutlinedIcon },
    { label: 'Sequência', value: streakLabel, Icon: LocalFireDepartmentOutlinedIcon },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* ── Header with role identity ─────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
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

        {/* Role badge */}
        {user && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.75,
              borderRadius: '10px',
              bgcolor: `${roleAccent}14`,
              border: `1px solid ${roleAccent}44`,
            }}
          >
            {isAdmin && <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 15, color: roleAccent }} />}
            {isMentor && <GroupOutlinedIcon sx={{ fontSize: 15, color: roleAccent }} />}
            {!isAdmin && !isMentor && (
              <CheckCircleOutlinedIcon sx={{ fontSize: 15, color: roleAccent }} />
            )}
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: roleAccent,
                fontFamily: 'var(--f-mono)',
                fontWeight: 600,
                letterSpacing: '0.06em',
              }}
            >
              {ROLE_LABEL[user.role] ?? user.role}
            </Typography>
          </Box>
        )}
      </Box>

      {/* ── Role-specific top section ─────────────────────────────────────── */}
      {isAdmin && (
        <AdminSection
          trailCount={trails.length}
          totalChallenges={trails.reduce((a, t) => a + t.lessonsTotal, 0)}
          router={router}
        />
      )}
      {isMentor && <MentorSection />}

      {/* ── Stats — students only ────────────────────────────────────────── */}
      {isStudent && (
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
              <Box sx={{ color: tokens.text[2], mb: 1 }}>
                <s.Icon sx={{ fontSize: 16 }} />
              </Box>
              <Typography
                sx={{ fontFamily: 'var(--f-serif)', fontSize: 26, lineHeight: 1, mb: 0.5 }}
              >
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
      )}

      {/* ── Trails + Activity — students and admin only ───────────────────── */}
      {!isMentor && (
        <Box
          sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.5fr 1fr' }, gap: 2.5 }}
        >
          {/* Trail list */}
          <Box
            sx={{
              p: 3,
              bgcolor: tokens.bg[3],
              border: `1px solid ${tokens.line.default}`,
              borderRadius: '16px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2.5,
              }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                {isAdmin ? 'Trilhas Cadastradas' : 'Em andamento'}
              </Typography>
              <Typography
                onClick={() => router.push(isAdmin ? '/admin/trails' : '/trilha')}
                sx={{ fontSize: '0.75rem', color: 'primary.main', cursor: 'pointer' }}
              >
                Ver todas
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {trails.length === 0 && (
                <Typography sx={{ color: tokens.text[2], fontSize: '0.875rem' }}>
                  Nenhuma trilha disponível.
                </Typography>
              )}
              {trails.map((trail) => (
                <Box key={trail.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* Color dot */}
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
                    <Box
                      sx={{ width: 11, height: 11, borderRadius: '2px', bgcolor: trail.color }}
                    />
                  </Box>

                  {/* Title + meta */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {trail.title}
                    </Typography>
                    {/* Admin sees challenge count + level — no student progress */}
                    <Typography sx={{ fontSize: '0.75rem', color: tokens.text[2], mt: 0.25 }}>
                      {trail.lessonsTotal} desafio{trail.lessonsTotal !== 1 ? 's' : ''} ·{' '}
                      {trail.level}
                    </Typography>
                    {/* Only show progress bar for students */}
                    {isStudent && (
                      <LinearProgress
                        variant="determinate"
                        value={trail.progress}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          mt: 0.75,
                          bgcolor: tokens.bg[0],
                          '& .MuiLinearProgress-bar': { bgcolor: trail.color, borderRadius: 2 },
                        }}
                      />
                    )}
                  </Box>

                  <Button
                    size="small"
                    variant="text"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: '10px !important' }} />}
                    onClick={() =>
                      router.push(
                        isAdmin ? `/admin/trails/${trail.id}/edit` : `/trilha/${trail.id}`
                      )
                    }
                    sx={{
                      flexShrink: 0,
                      fontSize: '0.75rem',
                      color: tokens.text[2],
                      textTransform: 'none',
                      px: 1,
                      '&:hover': { color: 'text.primary', bgcolor: tokens.bg[4] },
                    }}
                  >
                    {isAdmin ? 'Editar' : 'Abrir'}
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Weekly activity chart — students only */}
          {isStudent && (
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
                {weeklyActivity.length === 0
                  ? PT_DAYS.slice(1).map((d) => (
                      <Box
                        key={d}
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
                          sx={{
                            width: '100%',
                            height: '3px',
                            bgcolor: tokens.line.default,
                            borderRadius: '4px 4px 2px 2px',
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: '0.625rem',
                            color: tokens.text[3],
                            fontFamily: 'var(--f-mono)',
                          }}
                        >
                          {d}
                        </Typography>
                      </Box>
                    ))
                  : weeklyActivity.map((d) => {
                      const pct = maxMins > 0 ? (d.mins / maxMins) * 100 : 0;
                      const isToday = d.day === todayPt;
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
                                ? roleAccent
                                : d.mins > 0
                                  ? tokens.line.strong
                                  : tokens.line.default,
                              borderRadius: '4px 4px 2px 2px',
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: '0.625rem',
                              color: isToday ? roleAccent : tokens.text[3],
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
          )}
        </Box>
      )}
    </Box>
  );
}
