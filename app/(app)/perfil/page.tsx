'use client';

import { useStore } from '../../../store/useStore';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import { tokens } from '../../../lib/tokens';

const MOCK_PROFILE = {
  name: 'Ana Souza',
  email: 'ana.souza@email.com',
  avatarInitials: 'AS',
  role: 'aluno' as const,
  level: 3,
  joinedAt: '2024-03-10',
};

const ROLE_LABEL: Record<string, string> = {
  aluno: 'Estudante',
  mentor: 'Tutor',
  admin: 'Administrador',
};

export default function PerfilPage() {
  const storeUser = useStore((s) => s.user);
  const trails = useStore((s) => s.trails);

  const user = storeUser ?? MOCK_PROFILE;

  const joined = new Date(user.joinedAt);
  const joinedStr = joined.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalLessons = trails.reduce((a, t) => a + t.lessonsDone, 0);
  const totalHours = trails.reduce((a, t) => a + t.hoursDone, 0).toFixed(1);

  const STATS = [
    {
      icon: <LayersOutlinedIcon sx={{ fontSize: 18 }} />,
      label: 'Trilhas',
      value: String(trails.length),
    },
    {
      icon: <SchoolOutlinedIcon sx={{ fontSize: 18 }} />,
      label: 'Aulas concluídas',
      value: String(totalLessons),
    },
    {
      icon: <EmojiEventsOutlinedIcon sx={{ fontSize: 18 }} />,
      label: 'Nível',
      value: `Nível ${user.level}`,
    },
    {
      icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />,
      label: 'Membro desde',
      value: joinedStr,
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 720 }}>
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
          Perfil
        </Typography>
        <Typography sx={{ color: tokens.text[2], fontSize: '0.875rem' }}>
          Suas informações e progresso
        </Typography>
      </Box>

      {/* Avatar card */}
      <Box
        sx={{
          p: 3,
          bgcolor: tokens.bg[3],
          border: `1px solid ${tokens.line.default}`,
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
        }}
      >
        {/* Avatar */}
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF6200 0%, #E55A00 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 26,
            flexShrink: 0,
            letterSpacing: '0.02em',
          }}
        >
          {user.avatarInitials}
        </Box>

        {/* Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
              {user.name}
            </Typography>
            <Box
              sx={{
                px: '8px',
                py: '3px',
                borderRadius: '6px',
                bgcolor: tokens.orange.soft,
                border: `1px solid ${tokens.orange.ring}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.6875rem',
                  color: 'primary.main',
                  fontFamily: 'var(--f-mono)',
                  letterSpacing: '0.08em',
                }}
              >
                {ROLE_LABEL[user.role] ?? user.role}
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ fontSize: '0.875rem', color: tokens.text[2] }}>
            {user.email}
          </Typography>
        </Box>
      </Box>

      {/* Stats grid */}
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
            <Typography
              sx={{ fontFamily: 'var(--f-serif)', fontSize: 22, lineHeight: 1.1, mb: 0.5, wordBreak: 'break-word' }}
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

      {/* Info section */}
      <Box
        sx={{
          p: 3,
          bgcolor: tokens.bg[3],
          border: `1px solid ${tokens.line.default}`,
          borderRadius: '16px',
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', mb: 2 }}>
          Informações da conta
        </Typography>

        {[
          { label: 'Nome completo', value: user.name },
          { label: 'E-mail', value: user.email },
          { label: 'Papel', value: ROLE_LABEL[user.role] ?? user.role },
          { label: 'Nível de gamificação', value: `Nível ${user.level}` },
          { label: 'Membro desde', value: joinedStr },
          { label: 'Horas de estudo', value: `${totalHours}h` },
        ].map((row, i, arr) => (
          <Box key={row.label}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.5,
              }}
            >
              <Typography sx={{ fontSize: '0.875rem', color: tokens.text[2] }}>
                {row.label}
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {row.value}
              </Typography>
            </Box>
            {i < arr.length - 1 && (
              <Divider sx={{ borderColor: tokens.line.default }} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
