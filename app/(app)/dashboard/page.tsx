'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../store/useStore';
import { WEEKLY_ACTIVITY } from '../../../mocks/activity';
import { tokens } from '../../../lib/tokens';

const MAX_MINS = Math.max(...WEEKLY_ACTIVITY.map((d) => d.mins));

export default function DashboardPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const trails = useStore((s) => s.trails);
  const aiRecomendacao = useStore((s) => s.aiRecomendacao);

  const firstName = user?.name?.split(' ')[0] ?? 'Aluno';
  const activeTrail = trails[0];
  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const aiTitle = aiRecomendacao?.trilhaPrincipal.title ?? 'Próximo passo sugerido';
  const aiDesc = aiRecomendacao?.recomendacao.descricao ?? activeTrail?.aiNote ?? '';
  const aiTrailId = aiRecomendacao?.trilhaPrincipal.id ?? trails[1]?.id ?? activeTrail?.id;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Page header */}
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
            mb: 0.5,
          }}
        >
          Olá, {firstName}.
        </Typography>
        <Typography sx={{ color: 'text.disabled', fontSize: '0.875rem' }}>
          Semana 4 da sua trilha · Continue o ritmo
        </Typography>
      </Box>

      {/* Hero: continue-learning + AI card */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' }, gap: 2.5 }}>
        {/* Continue learning */}
        <Box
          sx={{
            p: 3,
            bgcolor: tokens.bg[3],
            border: `1px solid ${tokens.line.default}`,
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 220,
              height: 220,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,98,0,0.18), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Box
                sx={{
                  px: '8px',
                  py: '2px',
                  borderRadius: '6px',
                  bgcolor: tokens.orange.soft,
                  border: `1px solid ${tokens.orange.ring}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.6875rem',
                    color: 'primary.main',
                    letterSpacing: '0.08em',
                    fontFamily: 'var(--f-mono)',
                  }}
                >
                  EM ANDAMENTO
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: tokens.text[2] }}>
                {activeTrail.progress}% concluído
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 600, fontSize: '1.125rem', mb: 0.5 }}>
              {activeTrail.title}
            </Typography>
            <Typography
              sx={{ fontSize: '0.8125rem', color: tokens.text[2], mb: 2, lineHeight: 1.4 }}
            >
              {activeTrail.subtitle}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={activeTrail.progress}
              sx={{
                height: 4,
                borderRadius: 2,
                mb: 2,
                bgcolor: tokens.line.strong,
                '& .MuiLinearProgress-bar': { bgcolor: 'primary.main', borderRadius: 2 },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.6875rem',
                    color: tokens.text[3],
                    fontFamily: 'var(--f-mono)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    mb: 0.25,
                  }}
                >
                  Próxima aula
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <PlayCircleOutlinedIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                    {activeTrail.nextLesson}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                size="small"
                endIcon={<ArrowForwardIcon sx={{ fontSize: '12px !important' }} />}
                onClick={() => activeTrail && router.push(`/trilha/${activeTrail.id}`)}
                sx={{ borderRadius: '8px', fontSize: '0.8125rem' }}
              >
                Continuar
              </Button>
            </Box>
          </Box>
        </Box>

        {/* AI recommendation */}
        <Box
          sx={{
            p: 3,
            bgcolor: tokens.violet.soft,
            border: `1px solid ${tokens.violet.ring}`,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 2 }}>
            <AutoAwesomeIcon sx={{ fontSize: 13, color: tokens.violet.main }} />
            <Typography
              variant="caption"
              sx={{ color: tokens.violet.main, letterSpacing: '0.1em', fontSize: '0.6875rem' }}
            >
              RECOMENDAÇÃO DA IA
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', mb: 1 }}>{aiTitle}</Typography>
          <Typography
            sx={{ fontSize: '0.8125rem', color: tokens.text[2], lineHeight: 1.5, flex: 1 }}
          >
            {aiDesc}
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            size="small"
            onClick={() => aiTrailId && router.push(`/trilha/${aiTrailId}`)}
            sx={{
              mt: 2.5,
              borderRadius: '8px',
              borderColor: tokens.violet.ring,
              color: tokens.violet.main,
              fontSize: '0.8125rem',
              '&:hover': { borderColor: tokens.violet.main, bgcolor: tokens.violet.soft },
            }}
          >
            Ver trilha recomendada
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {[
          { label: 'Esta semana', value: '5.4h', sub: 'de estudo', icon: '📚' },
          { label: 'Sequência', value: '12 dias', sub: 'consecutivos', icon: '🔥' },
          { label: 'Aulas concluídas', value: '26', sub: 'no total', icon: '✓' },
          { label: 'Ranking', value: 'Top 15%', sub: 'entre alunos', icon: '🏆' },
        ].map((stat) => (
          <Box
            key={stat.label}
            sx={{
              p: 2.5,
              bgcolor: tokens.bg[3],
              border: `1px solid ${tokens.line.default}`,
              borderRadius: '12px',
            }}
          >
            <Typography sx={{ fontSize: '1.25rem', mb: 0.75 }}>{stat.icon}</Typography>
            <Typography sx={{ fontSize: '1.375rem', fontWeight: 700, lineHeight: 1 }}>
              {stat.value}
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: tokens.text[3], mt: 0.25 }}>
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Bottom: activity + trails */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
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
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 80 }}>
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
                      color: tokens.text[3],
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

        {/* My trails */}
        <Box
          sx={{
            p: 3,
            bgcolor: tokens.bg[3],
            border: `1px solid ${tokens.line.default}`,
            borderRadius: '16px',
          }}
        >
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>Minhas trilhas</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'primary.main', cursor: 'pointer' }}>
              Ver todas
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
            {trails.map((trail) => (
              <Box
                key={trail.id}
                onClick={() => router.push(`/trilha/${trail.id}`)}
                sx={{ display: 'flex', gap: 1.75, alignItems: 'center', cursor: 'pointer' }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    bgcolor: `${trail.color}22`,
                    border: `1px solid ${trail.color}44`,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: trail.color }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography
                      sx={{
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {trail.title}
                    </Typography>
                    <Typography
                      sx={{ fontSize: '0.75rem', color: tokens.text[2], flexShrink: 0, ml: 1 }}
                    >
                      {trail.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={trail.progress}
                    sx={{
                      height: 3,
                      borderRadius: 2,
                      bgcolor: tokens.line.strong,
                      '& .MuiLinearProgress-bar': { bgcolor: trail.color, borderRadius: 2 },
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
