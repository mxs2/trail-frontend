'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import Logo from '../../../components/ui/Logo';
import { tokens } from '../../../lib/tokens';
import { api } from '../../../services/api';
import type { Trail } from '../../../types';

// ─── Level config ─────────────────────────────────────────────────────────────

const LEVEL_CHIP: Record<string, { label: string; color: string }> = {
  Iniciante: { label: 'Iniciante', color: '#5EEAD4' },
  Intermediário: { label: 'Intermediário', color: '#F59E0B' },
  Avançado: { label: 'Avançado', color: '#F87171' },
};

// ─── Trail card ───────────────────────────────────────────────────────────────

function TrailCard({ trail, onStart }: { trail: Trail; onStart: () => void }) {
  const lvl = LEVEL_CHIP[trail.level] ?? { label: trail.level, color: tokens.text[2] };

  return (
    <Box
      onClick={onStart}
      sx={{
        bgcolor: tokens.bg[3],
        border: `1px solid ${tokens.line.default}`,
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 140ms, transform 140ms, box-shadow 140ms',
        '&:hover': {
          borderColor: `${trail.color}55`,
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 24px ${trail.color}18`,
        },
      }}
    >
      {/* Gradient banner */}
      <Box
        sx={{
          height: 6,
          background: `linear-gradient(90deg, ${trail.color} 0%, ${trail.color}88 100%)`,
        }}
      />

      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {/* Icon + level */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              bgcolor: `${trail.color}18`,
              border: `1px solid ${trail.color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ width: 16, height: 16, borderRadius: '4px', bgcolor: trail.color }} />
          </Box>
          <Chip
            label={lvl.label}
            size="small"
            sx={{
              height: 22,
              fontSize: '0.6875rem',
              fontFamily: 'var(--f-mono)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              bgcolor: `${lvl.color}18`,
              border: `1px solid ${lvl.color}44`,
              color: lvl.color,
            }}
          />
        </Box>

        {/* Title + subtitle */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.0625rem', mb: 0.5, lineHeight: 1.3 }}>
            {trail.title}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.8125rem',
              color: tokens.text[2],
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {trail.subtitle}
          </Typography>
        </Box>

        {/* Meta footer */}
        <Box
          sx={{
            borderTop: `1px solid ${tokens.line.default}`,
            pt: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: tokens.text[2] }}>
              <AssignmentOutlinedIcon sx={{ fontSize: 13 }} />
              <Typography sx={{ fontSize: '0.75rem' }}>{trail.lessonsTotal} desafios</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: tokens.text[2] }}>
              <AccessTimeOutlinedIcon sx={{ fontSize: 13 }} />
              <Typography sx={{ fontSize: '0.75rem' }}>{trail.hoursTotal}h</Typography>
            </Box>
          </Box>

          <Button
            size="small"
            variant="contained"
            endIcon={<ArrowForwardIcon sx={{ fontSize: '11px !important' }} />}
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              fontSize: '0.75rem',
              py: 0.5,
              px: 1.5,
              bgcolor: trail.color,
              '&:hover': { bgcolor: trail.color, filter: 'brightness(0.88)' },
            }}
          >
            Começar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const LEVELS = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'];

export default function ExplorarPage() {
  const router = useRouter();
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('Todos');

  useEffect(() => {
    api
      .getTrails()
      .then(setTrails)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = trails.filter((t) => {
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = level === 'Todos' || t.level === level;
    return matchesSearch && matchesLevel;
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sticky header */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          px: { xs: 3, md: 6 },
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: `1px solid ${tokens.line.default}`,
          bgcolor: 'background.default',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Logo />
        <Box sx={{ flex: 1 }} />
        <Button
          variant="outlined"
          onClick={() => router.push('/signin')}
          sx={{
            textTransform: 'none',
            borderRadius: '10px',
            borderColor: tokens.line.strong,
            color: tokens.text[2],
            fontSize: '0.8125rem',
            '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
          }}
        >
          Entrar
        </Button>
        <Button
          variant="contained"
          onClick={() => router.push('/signup')}
          sx={{ textTransform: 'none', borderRadius: '10px', fontSize: '0.8125rem' }}
        >
          Criar conta grátis
        </Button>
      </Box>

      {/* Hero */}
      <Box
        sx={{
          px: { xs: 3, md: 6 },
          pt: { xs: 6, md: 9 },
          pb: { xs: 5, md: 7 },
          maxWidth: 900,
          mx: 'auto',
          textAlign: 'center',
        }}
      >
        {/* Badge */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.5,
            borderRadius: '20px',
            bgcolor: tokens.orange.soft,
            border: `1px solid ${tokens.orange.ring}`,
            mb: 3,
          }}
        >
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: 'primary.main',
              fontFamily: 'var(--f-mono)',
              letterSpacing: '0.08em',
            }}
          >
            PLATAFORMA DE TRILHAS TECH
          </Typography>
        </Box>

        <Typography
          component="h1"
          sx={{
            fontFamily: 'var(--f-serif)',
            fontSize: { xs: '2.25rem', md: '3.5rem' },
            fontWeight: 400,
            lineHeight: 1.1,
            mb: 2,
          }}
        >
          Aprenda tecnologia com{' '}
          <Box component="span" sx={{ color: 'primary.main' }}>
            trilhas estruturadas
          </Box>
        </Typography>

        <Typography
          sx={{
            color: tokens.text[2],
            fontSize: { xs: '1rem', md: '1.125rem' },
            mb: 4,
            maxWidth: 580,
            mx: 'auto',
            lineHeight: 1.65,
          }}
        >
          Desafios práticos, feedback de mentores e progressão clara. Do fundamento ao deploy, com
          IA personalizando cada etapa do seu aprendizado.
        </Typography>

        {/* Stats pills */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 5 }}>
          {[
            { value: `${trails.length}`, label: 'trilhas disponíveis' },
            {
              value: `${trails.reduce((a, t) => a + t.lessonsTotal, 0)}`,
              label: 'desafios práticos',
            },
            {
              value: `${trails.reduce((a, t) => a + t.hoursTotal, 0).toFixed(0)}h`,
              label: 'de conteúdo',
            },
          ].map((s) => (
            <Box
              key={s.label}
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: '10px',
                bgcolor: tokens.bg[3],
                border: `1px solid ${tokens.line.default}`,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--f-mono)',
                  fontWeight: 700,
                  color: 'primary.main',
                  fontSize: '1.125rem',
                }}
              >
                {s.value}
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: tokens.text[2] }}>
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {loading && <LinearProgress sx={{ borderRadius: 2 }} />}
      </Box>

      {/* Filter bar */}
      <Box sx={{ px: { xs: 3, md: 6 }, pb: 3, maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: '10px',
              bgcolor: tokens.bg[3],
              border: `1px solid ${tokens.line.default}`,
              flex: { xs: '1 1 100%', sm: '0 1 280px' },
              '&:focus-within': { borderColor: 'primary.main' },
            }}
          >
            <SearchIcon sx={{ fontSize: 16, color: tokens.text[2], flexShrink: 0 }} />
            <InputBase
              placeholder="Buscar trilha…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                flex: 1,
                fontSize: '0.875rem',
                color: 'text.primary',
                '& input::placeholder': { color: tokens.text[2] },
              }}
            />
          </Box>

          {/* Level filter */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {LEVELS.map((l) => (
              <Chip
                key={l}
                label={l}
                onClick={() => setLevel(l)}
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--f-mono)',
                  bgcolor: level === l ? 'primary.main' : tokens.bg[3],
                  color: level === l ? '#fff' : tokens.text[2],
                  border: `1px solid ${level === l ? 'primary.main' : tokens.line.default}`,
                  '&:hover': { bgcolor: level === l ? 'primary.main' : tokens.bg[4] },
                }}
              />
            ))}
          </Box>

          <Typography
            sx={{
              ml: 'auto',
              fontSize: '0.8125rem',
              color: tokens.text[2],
              fontFamily: 'var(--f-mono)',
            }}
          >
            {filtered.length} trilha{filtered.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      </Box>

      {/* Trail grid */}
      <Box
        sx={{
          px: { xs: 3, md: 6 },
          pb: { xs: 6, md: 10 },
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        {!loading && filtered.length === 0 ? (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <Typography sx={{ color: tokens.text[2], fontSize: '1rem' }}>
              {search || level !== 'Todos'
                ? 'Nenhuma trilha encontrada com esses filtros.'
                : 'Nenhuma trilha disponível. Crie uma no console de administração.'}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 2.5,
            }}
          >
            {filtered.map((trail) => (
              <TrailCard key={trail.id} trail={trail} onStart={() => router.push('/signup')} />
            ))}
          </Box>
        )}
      </Box>

      {/* CTA footer */}
      <Box
        sx={{
          borderTop: `1px solid ${tokens.line.default}`,
          py: { xs: 6, md: 8 },
          px: { xs: 3, md: 6 },
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'var(--f-serif)',
            fontSize: { xs: '1.75rem', md: '2.5rem' },
            fontWeight: 400,
            mb: 1.5,
          }}
        >
          Pronto para começar?
        </Typography>
        <Typography sx={{ color: tokens.text[2], mb: 3.5, fontSize: '1rem' }}>
          Crie sua conta gratuitamente e escolha sua primeira trilha.
        </Typography>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForwardIcon />}
          onClick={() => router.push('/signup')}
          sx={{ textTransform: 'none', borderRadius: '12px', px: 4, fontWeight: 600 }}
        >
          Começar agora, é grátis
        </Button>
      </Box>
    </Box>
  );
}
