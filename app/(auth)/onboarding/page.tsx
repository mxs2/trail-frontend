'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useStore } from '../../../store/useStore';
import { api, type OnboardingProfile } from '../../../services/api';
import Logo from '../../../components/ui/Logo';
import { tokens } from '../../../lib/tokens';

// ── Option sets ───────────────────────────────────────────────────────────────

const ROLES = [
  'Backend Developer (Node.js)',
  'Backend Developer (.NET / C#)',
  'Frontend Developer (React)',
  'Full Stack Developer',
  'DevOps / SRE',
  'Data Engineer',
  'Mobile Developer (React Native)',
];

const DEPTHS = [
  { value: 'beginner', label: 'Iniciante', desc: 'Menos de 1 ano de experiência' },
  { value: 'intermediate', label: 'Intermediário', desc: '1 a 3 anos de experiência' },
  { value: 'advanced', label: 'Avançado', desc: 'Mais de 3 anos de experiência' },
];

const HOURS = [
  { value: '<5', label: 'Menos de 5h' },
  { value: '5-10', label: '5 a 10h' },
  { value: '10-20', label: '10 a 20h' },
  { value: '20+', label: 'Mais de 20h' },
];

const STYLES = [
  { value: 'hands-on', label: 'Mão na massa', desc: 'Projetos e desafios práticos' },
  { value: 'visual', label: 'Visual', desc: 'Vídeos e diagramas' },
  { value: 'theoretical', label: 'Teórico', desc: 'Leitura e documentação' },
  { value: 'mixed', label: 'Misturado', desc: 'Um pouco de cada' },
];

// ── Chip option component ─────────────────────────────────────────────────────

function OptionChip({
  selected,
  label,
  desc,
  onClick,
}: {
  selected: boolean;
  label: string;
  desc?: string;
  onClick: () => void;
}) {
  return (
    <Box
      component="button"
      onClick={onClick}
      type="button"
      sx={{
        textAlign: 'left',
        cursor: 'pointer',
        p: 2,
        borderRadius: '12px',
        bgcolor: selected ? tokens.orange.soft : tokens.bg[3],
        outline: 'none',
        border: `1.5px solid ${selected ? tokens.orange.ring : tokens.line.default}`,
        transition: 'all 140ms',
        '&:hover': { borderColor: tokens.orange.ring, bgcolor: tokens.orange.soft },
      }}
    >
      <Typography
        sx={{
          fontSize: '0.9rem',
          fontWeight: 600,
          color: selected ? 'primary.main' : 'text.primary',
        }}
      >
        {label}
      </Typography>
      {desc && (
        <Typography sx={{ fontSize: '0.75rem', color: tokens.text[2], mt: 0.25 }}>
          {desc}
        </Typography>
      )}
    </Box>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const STEPS = [
  'Qual é o seu objetivo?',
  'Qual é o seu nível técnico?',
  'Quantas horas por semana você estuda?',
  'Como você prefere aprender?',
  'O que você quer construir?',
];

export default function OnboardingPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const setTrails = useStore((s) => s.setTrails);

  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<OnboardingProfile>>({});
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) router.replace('/signup');
  }, [user, router]);

  // ── Step validation ─────────────────────────────────────────────────────────
  const canAdvance = (): boolean => {
    switch (step) {
      case 0:
        return !!profile.targetRole;
      case 1:
        return !!profile.technicalDepth;
      case 2:
        return !!profile.weeklyHours;
      case 3:
        return !!profile.learningStyle;
      case 4:
        return !!profile.projectGoal?.trim();
      default:
        return false;
    }
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleGenerate() {
    setGenerating(true);
    setError('');
    try {
      const result = await api.generateTrail(profile as OnboardingProfile);
      // Refresh trail list so the new trail appears everywhere
      const fresh = await api.getTrails();
      setTrails(fresh);
      router.push(`/trilha/${result.trailId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar a trilha. Tente novamente.');
      setGenerating(false);
    }
  }

  // ── Generating state ────────────────────────────────────────────────────────
  if (generating) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '16px',
            bgcolor: tokens.orange.soft,
            border: `1px solid ${tokens.orange.ring}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontFamily: 'var(--f-serif)', fontSize: '1.5rem', mb: 1 }}>
            Criando sua trilha personalizada…
          </Typography>
          <Typography sx={{ color: tokens.text[2], fontSize: '0.9rem', mb: 3 }}>
            A IA está analisando seu perfil e montando os desafios. Isso pode levar 20 a 30
            segundos.
          </Typography>
          <CircularProgress size={32} sx={{ color: 'primary.main' }} />
        </Box>
      </Box>
    );
  }

  // ── Step content ────────────────────────────────────────────────────────────
  function StepContent() {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {ROLES.map((r) => (
              <OptionChip
                key={r}
                label={r}
                selected={profile.targetRole === r}
                onClick={() => setProfile((p) => ({ ...p, targetRole: r }))}
              />
            ))}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {DEPTHS.map((d) => (
              <OptionChip
                key={d.value}
                label={d.label}
                desc={d.desc}
                selected={profile.technicalDepth === d.value}
                onClick={() =>
                  setProfile((p) => ({
                    ...p,
                    technicalDepth: d.value as OnboardingProfile['technicalDepth'],
                  }))
                }
              />
            ))}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.25 }}>
            {HOURS.map((h) => (
              <OptionChip
                key={h.value}
                label={h.label}
                selected={profile.weeklyHours === h.value}
                onClick={() =>
                  setProfile((p) => ({
                    ...p,
                    weeklyHours: h.value as OnboardingProfile['weeklyHours'],
                  }))
                }
              />
            ))}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {STYLES.map((s) => (
              <OptionChip
                key={s.value}
                label={s.label}
                desc={s.desc}
                selected={profile.learningStyle === s.value}
                onClick={() =>
                  setProfile((p) => ({
                    ...p,
                    learningStyle: s.value as OnboardingProfile['learningStyle'],
                  }))
                }
              />
            ))}
          </Box>
        );

      case 4:
        return (
          <TextField
            multiline
            rows={4}
            fullWidth
            label="Descreva seu objetivo"
            placeholder="Ex: Quero criar uma API REST para um sistema de agendamento de consultas usando .NET e SQL Server"
            value={profile.projectGoal ?? ''}
            onChange={(e) => setProfile((p) => ({ ...p, projectGoal: e.target.value }))}
            autoFocus
          />
        );

      default:
        return null;
    }
  }

  const progress = (step / STEPS.length) * 100;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          px: { xs: 3, md: 6 },
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: `1px solid ${tokens.line.default}`,
        }}
      >
        <Logo />
        <Box sx={{ flex: 1 }} />
        <Button
          variant="text"
          onClick={() => router.push('/explorar')}
          sx={{ color: tokens.text[2], fontSize: '0.8125rem', textTransform: 'none' }}
        >
          Pular →
        </Button>
      </Box>

      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 3,
          bgcolor: tokens.bg[3],
          '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' },
        }}
      />

      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          px: { xs: 3, md: 6 },
          py: { xs: 5, md: 8 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 520 }}>
          {/* Step indicator */}
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontFamily: 'var(--f-mono)',
              color: tokens.text[2],
              letterSpacing: '0.1em',
              mb: 1.5,
            }}
          >
            PASSO {step + 1} DE {STEPS.length}
          </Typography>

          {/* Question */}
          <Typography
            component="h1"
            sx={{
              fontFamily: 'var(--f-serif)',
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 400,
              lineHeight: 1.2,
              mb: 3,
            }}
          >
            {STEPS[step]}
          </Typography>

          {/* Options */}
          <StepContent />

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: '10px' }}>
              {error}
            </Alert>
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1.5, mt: 3, justifyContent: 'flex-end' }}>
            {step > 0 && (
              <Button
                variant="outlined"
                onClick={() => setStep((s) => s - 1)}
                sx={{
                  textTransform: 'none',
                  borderRadius: '10px',
                  borderColor: tokens.line.strong,
                  color: tokens.text[2],
                }}
              >
                Voltar
              </Button>
            )}

            {step < STEPS.length - 1 ? (
              <Button
                variant="contained"
                disabled={!canAdvance()}
                endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
                onClick={() => setStep((s) => s + 1)}
                sx={{ textTransform: 'none', borderRadius: '10px', px: 3 }}
              >
                Próximo
              </Button>
            ) : (
              <Button
                variant="contained"
                disabled={!canAdvance()}
                startIcon={<AutoAwesomeIcon sx={{ fontSize: '16px !important' }} />}
                onClick={handleGenerate}
                sx={{ textTransform: 'none', borderRadius: '10px', px: 3, fontWeight: 600 }}
              >
                Gerar minha trilha
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
