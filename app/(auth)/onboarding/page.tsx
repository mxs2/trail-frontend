'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Slider from '@mui/material/Slider';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BoltIcon from '@mui/icons-material/Bolt';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ArticleIcon from '@mui/icons-material/Article';
import CodeIcon from '@mui/icons-material/Code';
import LayersIcon from '@mui/icons-material/Layers';
import { useStore } from '../../../store/useStore';
import { api } from '../../../services/api';
import Logo from '../../../components/ui/Logo';
import { tokens } from '../../../lib/tokens';

// ─── Step data ───────────────────────────────────────────────────────────────

const STEPS = [
  {
    id: 'goal',
    title: 'Qual seu objetivo principal?',
    sub: 'A IA vai moldar sua trilha em torno dele.',
  },
  { id: 'area', title: 'Qual área você quer aprofundar?', sub: 'Você pode combinar mais de uma.' },
  {
    id: 'level',
    title: 'Como você avalia seu nível atual?',
    sub: 'Seja honesto — isso muda a profundidade dos módulos.',
  },
  {
    id: 'time',
    title: 'Quanto tempo por dia?',
    sub: 'Estimativa realista para manter consistência.',
  },
  {
    id: 'style',
    title: 'Como você aprende melhor?',
    sub: 'A IA prioriza esse formato quando possível.',
  },
  { id: 'generating', title: 'Gerando sua trilha…', sub: 'A IA está montando tudo sob medida.' },
];

const GOALS = [
  { k: 'job', label: 'Conseguir meu primeiro emprego dev', Icon: GpsFixedIcon },
  { k: 'promo', label: 'Subir de nível na carreira', Icon: TrendingUpIcon },
  { k: 'switch', label: 'Trocar de stack', Icon: BoltIcon },
  { k: 'freelance', label: 'Pegar freelas', Icon: WhatshotIcon },
];

const AREAS = [
  { k: 'react', label: 'React' },
  { k: 'next', label: 'Next.js' },
  { k: 'ts', label: 'TypeScript' },
  { k: 'node', label: 'Node.js' },
  { k: 'css', label: 'CSS avançado' },
  { k: 'ux', label: 'UX/UI' },
  { k: 'db', label: 'Databases' },
  { k: 'devops', label: 'DevOps' },
];

const LEVELS = [
  { k: 'begin', label: 'Iniciante', sub: 'Estou começando ou revisando fundamentos' },
  { k: 'mid', label: 'Intermediário', sub: 'Consigo construir apps, mas quero estruturar melhor' },
  { k: 'adv', label: 'Avançado', sub: 'Já trabalho com isso e quero aprofundar' },
];

const STYLES = [
  { k: 'video', label: 'Vídeo', Icon: OndemandVideoIcon },
  { k: 'reading', label: 'Leitura', Icon: ArticleIcon },
  { k: 'hands', label: 'Mão na massa', Icon: CodeIcon },
  { k: 'mixed', label: 'Misto', Icon: LayersIcon },
];

// ─── Shared card sx helpers ──────────────────────────────────────────────────

function cardSx(selected: boolean) {
  return {
    border: `1px solid ${selected ? '#FF6200' : tokens.line.strong}`,
    borderRadius: '12px',
    bgcolor: selected ? tokens.orange.soft : 'background.paper',
    cursor: 'pointer',
    transition: 'all 120ms',
    '&:hover': { bgcolor: selected ? tokens.orange.soft : tokens.bg[3] },
  } as const;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const setAiRecomendacao = useStore((s) => s.setAiRecomendacao);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    goal: '',
    areas: [] as string[],
    level: '',
    time: 45,
    style: '',
  });

  // Simple guard — acceptable flash in prototype mode
  useEffect(() => {
    if (!user) router.replace('/signup');
  }, [user, router]);

  // Generating step: parallel API call + min 2s delay, then navigate
  useEffect(() => {
    if (STEPS[step].id !== 'generating' || !user) return;
    let active = true;
    Promise.all([
      api.getTrilhaPersonalizada(user.id),
      new Promise<void>((res) => setTimeout(res, 2000)),
    ]).then(([result]) => {
      if (!active) return;
      setAiRecomendacao(result);
      router.push('/dashboard');
    });
    return () => {
      active = false;
    };
  }, [step, user, setAiRecomendacao, router]);

  const s = STEPS[step];
  const totalQuestions = STEPS.length - 1; // 5 questions, generating doesn't count
  const progressPct = (Math.min(step, totalQuestions) / totalQuestions) * 100;

  const canNext = (() => {
    switch (s.id) {
      case 'goal':
        return !!answers.goal;
      case 'area':
        return answers.areas.length > 0;
      case 'level':
        return !!answers.level;
      case 'time':
        return true;
      case 'style':
        return !!answers.style;
      default:
        return false;
    }
  })();

  function next() {
    setStep((v) => v + 1);
  }
  function back() {
    setStep((v) => Math.max(0, v - 1));
  }
  function toggleArea(k: string) {
    setAnswers((a) => ({
      ...a,
      areas: a.areas.includes(k) ? a.areas.filter((x) => x !== k) : [...a.areas, k],
    }));
  }

  const isLastQuestion = step === totalQuestions - 1;
  const isGenerating = s.id === 'generating';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box
        component="header"
        sx={{
          px: 5,
          py: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: `1px solid ${tokens.line.default}`,
        }}
      >
        <Logo />
        <Typography
          variant="caption"
          sx={{
            ml: 1.5,
            color: tokens.text[2],
            fontFamily: 'var(--f-mono)',
            letterSpacing: '0.08em',
            fontSize: 12,
          }}
        >
          ONBOARDING
        </Typography>

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="caption"
            sx={{ fontFamily: 'var(--f-mono)', color: tokens.text[2], fontSize: 12 }}
          >
            {Math.min(step + 1, totalQuestions)} de {totalQuestions}
          </Typography>
          <Box sx={{ width: 160 }}>
            <LinearProgress
              variant="determinate"
              value={progressPct}
              sx={{
                height: 4,
                borderRadius: 4,
                bgcolor: tokens.bg[3],
                '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 5 }}>
        <Box sx={{ width: '100%', maxWidth: 680 }}>
          {/* Eyebrow */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
            <AutoAwesomeIcon sx={{ fontSize: 10, color: 'primary.main' }} />
            <Typography
              variant="caption"
              sx={{ color: 'primary.main', letterSpacing: '0.12em', fontSize: 11 }}
            >
              TRILHA PERSONALIZADA PELA IA
            </Typography>
          </Box>

          {/* Step title */}
          <Typography
            component="h1"
            sx={{
              fontFamily: 'var(--f-serif)',
              fontSize: '2.625rem',
              fontWeight: 400,
              lineHeight: 1.1,
              mb: 1.25,
            }}
          >
            {s.title}
          </Typography>

          {/* Step subtitle */}
          <Typography sx={{ color: 'text.disabled', fontSize: '0.9375rem', mb: 4.5 }}>
            {s.sub}
          </Typography>

          {/* ── Step: goal ─────────────────────────────────────────────────── */}
          {s.id === 'goal' && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {GOALS.map((g) => {
                const sel = answers.goal === g.k;
                return (
                  <Box
                    key={g.k}
                    component="button"
                    onClick={() => setAnswers((a) => ({ ...a, goal: g.k }))}
                    sx={{
                      ...cardSx(sel),
                      p: 2.5,
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.75,
                      width: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        flexShrink: 0,
                        bgcolor: sel ? 'primary.main' : tokens.bg[3],
                        color: sel ? '#fff' : 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <g.Icon sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography
                      sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary' }}
                    >
                      {g.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}

          {/* ── Step: area ─────────────────────────────────────────────────── */}
          {s.id === 'area' && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
              {AREAS.map((a) => {
                const on = answers.areas.includes(a.k);
                return (
                  <Box
                    key={a.k}
                    component="button"
                    onClick={() => toggleArea(a.k)}
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      border: `1px solid ${on ? '#FF6200' : tokens.line.strong}`,
                      borderRadius: '999px',
                      bgcolor: on ? tokens.orange.soft : 'background.paper',
                      color: on ? '#FF6200' : 'text.primary',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      transition: 'all 120ms',
                    }}
                  >
                    {on && <CheckIcon sx={{ fontSize: 13 }} />}
                    {a.label}
                  </Box>
                );
              })}
            </Box>
          )}

          {/* ── Step: level ────────────────────────────────────────────────── */}
          {s.id === 'level' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {LEVELS.map((l) => {
                const sel = answers.level === l.k;
                return (
                  <Box
                    key={l.k}
                    component="button"
                    onClick={() => setAnswers((a) => ({ ...a, level: l.k }))}
                    sx={{
                      ...cardSx(sel),
                      p: 2.25,
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.75,
                      width: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        flexShrink: 0,
                        border: `2px solid ${sel ? '#FF6200' : tokens.line.strong}`,
                        bgcolor: sel ? tokens.orange.soft : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.main',
                      }}
                    >
                      {sel && <CheckIcon sx={{ fontSize: 12 }} />}
                    </Box>
                    <Box>
                      <Typography
                        sx={{ fontSize: '0.9375rem', fontWeight: 600, color: 'text.primary' }}
                      >
                        {l.label}
                      </Typography>
                      <Typography sx={{ fontSize: '0.8125rem', color: 'text.disabled', mt: '2px' }}>
                        {l.sub}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}

          {/* ── Step: time ─────────────────────────────────────────────────── */}
          {s.id === 'time' && (
            <Box
              sx={{
                p: 4,
                bgcolor: 'background.paper',
                border: `1px solid ${tokens.line.default}`,
                borderRadius: '12px',
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--f-serif)',
                    fontSize: '4rem',
                    lineHeight: 1,
                    color: 'primary.main',
                  }}
                >
                  {answers.time}
                  <Box
                    component="span"
                    sx={{ fontSize: '1.5rem', color: 'text.disabled', ml: 0.75 }}
                  >
                    min
                  </Box>
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: 'text.disabled', mt: 1 }}>
                  por dia, em média
                </Typography>
              </Box>

              <Slider
                min={15}
                max={180}
                step={15}
                value={answers.time}
                onChange={(_e, v) => setAnswers((a) => ({ ...a, time: v as number }))}
                sx={{ color: 'primary.main' }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ fontFamily: 'var(--f-mono)', color: tokens.text[3] }}
                >
                  15min
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontFamily: 'var(--f-mono)', color: tokens.text[3] }}
                >
                  180min
                </Typography>
              </Box>

              <Box
                sx={{
                  mt: 2.5,
                  p: 1.75,
                  borderRadius: '8px',
                  bgcolor: tokens.violet.soft,
                  border: `1px solid ${tokens.violet.ring}`,
                  display: 'flex',
                  gap: 1.25,
                }}
              >
                <AutoAwesomeIcon
                  sx={{ fontSize: 14, color: tokens.violet.main, flexShrink: 0, mt: 0.125 }}
                />
                <Typography
                  sx={{ fontSize: '0.8125rem', color: 'text.secondary', lineHeight: 1.5 }}
                >
                  Com {answers.time}min/dia, sua trilha terá ~
                  <Box component="strong" sx={{ color: tokens.violet.main }}>
                    {' '}
                    {Math.ceil((18 * 60) / answers.time / 5)} semanas
                  </Box>{' '}
                  estimadas.
                </Typography>
              </Box>
            </Box>
          )}

          {/* ── Step: style ────────────────────────────────────────────────── */}
          {s.id === 'style' && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5 }}>
              {STYLES.map((f) => {
                const sel = answers.style === f.k;
                return (
                  <Box
                    key={f.k}
                    component="button"
                    onClick={() => setAnswers((a) => ({ ...a, style: f.k }))}
                    sx={{
                      ...cardSx(sel),
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1.25,
                      textAlign: 'center',
                      width: '100%',
                      color: sel ? '#FF6200' : 'text.secondary',
                    }}
                  >
                    <f.Icon sx={{ fontSize: 24 }} />
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: 'inherit' }}>
                      {f.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}

          {/* ── Step: generating ───────────────────────────────────────────── */}
          {s.id === 'generating' && (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: tokens.violet.soft,
                  color: tokens.violet.main,
                  mb: 3,
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                  animation: 'pulse 1.6s ease-in-out infinite',
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 36 }} />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.25,
                  maxWidth: 440,
                  mx: 'auto',
                  textAlign: 'left',
                }}
              >
                {[
                  'Analisando seu objetivo e nível…',
                  'Montando sequência de módulos…',
                  'Escolhendo melhores aulas para você…',
                  `Ajustando ritmo para ${answers.time}min/dia…`,
                ].map((text) => (
                  <Box
                    key={text}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      bgcolor: 'background.paper',
                      border: `1px solid ${tokens.line.default}`,
                      borderRadius: '8px',
                    }}
                  >
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        flexShrink: 0,
                        bgcolor: tokens.orange.soft,
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 11 }} />
                    </Box>
                    <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* ── Footer nav (hidden during generating) ──────────────────────── */}
          {!isGenerating && (
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 5 }}
            >
              <Button
                variant="text"
                startIcon={<ArrowBackIcon />}
                onClick={back}
                disabled={step === 0}
                sx={{ opacity: step === 0 ? 0.3 : 1 }}
              >
                Voltar
              </Button>
              <Button
                variant="contained"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                onClick={next}
                disabled={!canNext}
              >
                {isLastQuestion ? 'Gerar minha trilha' : 'Continuar'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
