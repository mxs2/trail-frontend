'use client';

import { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { api } from '../../../services/api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckIcon from '@mui/icons-material/Check';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import { tokens } from '../../../lib/tokens';

const ROLE_LABEL: Record<string, string> = {
  aluno: 'Estudante',
  mentor: 'Tutor',
  admin: 'Administrador',
};

const ROLE_COLOR: Record<string, string> = {
  admin: '#FF6200',
  mentor: '#A78BFA',
  aluno: '#5EEAD4',
};

// ── Mentor stats ──────────────────────────────────────────────────────────────

interface MentorStats {
  reviewsDone: number;
  approved: number;
  needsRevision: number;
  pendingInQueue: number;
}

function useMentorStats(isMentor: boolean) {
  const [stats, setStats] = useState<MentorStats | null>(null);
  useEffect(() => {
    if (!isMentor) return;
    api
      .getMentorStats()
      .then(setStats)
      .catch(() => {});
  }, [isMentor]);
  return stats;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PerfilPage() {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const trails = useStore((s) => s.trails);

  const isMentor = user?.role === 'mentor' || user?.role === 'admin';
  const isStudent = user?.role === 'aluno';
  const mentorStats = useMentorStats(isMentor);

  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  if (!user) return null;
  const { name, email, role, avatarInitials, level, joinedAt } = user;

  const joined = new Date(joinedAt);
  const joinedStr = joined.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const roleColor = ROLE_COLOR[role] ?? tokens.text[2];

  // ── Role-specific stat cards ──────────────────────────────────────────────

  const studentStats = [
    {
      icon: <LayersOutlinedIcon sx={{ fontSize: 18 }} />,
      label: 'Trilhas',
      value: String(trails.length),
    },
    {
      icon: <SchoolOutlinedIcon sx={{ fontSize: 18 }} />,
      label: 'Desafios concluídos',
      value: String(trails.reduce((a, t) => a + t.lessonsDone, 0)),
    },
    {
      icon: <EmojiEventsOutlinedIcon sx={{ fontSize: 18 }} />,
      label: 'Nível',
      value: `Nível ${level}`,
    },
    {
      icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />,
      label: 'Membro desde',
      value: joinedStr,
    },
  ];

  const mentorStatCards = [
    {
      icon: <AssignmentTurnedInOutlinedIcon sx={{ fontSize: 18 }} />,
      label: 'Revisões feitas',
      value: mentorStats ? String(mentorStats.reviewsDone) : '—',
    },
    {
      icon: <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} />,
      label: 'Aprovações',
      value: mentorStats ? String(mentorStats.approved) : '—',
    },
    {
      icon: <PendingOutlinedIcon sx={{ fontSize: 18 }} />,
      label: 'Na fila agora',
      value: mentorStats ? String(mentorStats.pendingInQueue) : '—',
    },
    {
      icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />,
      label: 'Membro desde',
      value: joinedStr,
    },
  ];

  const STATS = isMentor ? mentorStatCards : studentStats;

  // ── Account info table rows ───────────────────────────────────────────────

  const baseRows = [
    { label: 'Nome completo', value: name },
    { label: 'E-mail', value: email },
    { label: 'Papel', value: ROLE_LABEL[role] ?? role },
    { label: 'Membro desde', value: joinedStr },
  ];

  // Only show student-specific rows for students
  const studentRows = isStudent
    ? [
        { label: 'Nível de gamificação', value: `Nível ${level}` },
        {
          label: 'Horas de estudo',
          value: `${trails.reduce((a, t) => a + t.hoursDone, 0).toFixed(1)}h`,
        },
      ]
    : [];

  const mentorRows =
    isMentor && mentorStats
      ? [
          { label: 'Revisões feitas', value: String(mentorStats.reviewsDone) },
          { label: 'Aprovações', value: String(mentorStats.approved) },
          { label: 'Precisam de revisão', value: String(mentorStats.needsRevision) },
        ]
      : [];

  const accountRows = [...baseRows, ...studentRows, ...mentorRows];

  // ── Edit handler ──────────────────────────────────────────────────────────

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!nameInput.trim() || nameInput.trim() === name) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setSaveError('');
    try {
      const updated = await api.updateProfile(nameInput.trim());
      setUser(updated);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

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
          {isMentor ? 'Suas informações e atividade de revisão' : 'Suas informações e progresso'}
        </Typography>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ borderRadius: '12px' }}>
          Perfil atualizado com sucesso!
        </Alert>
      )}

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
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${roleColor} 0%, ${roleColor}cc 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 26,
            flexShrink: 0,
          }}
        >
          {avatarInitials}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {editing ? (
            <Box
              component="form"
              onSubmit={handleSave}
              sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
            >
              {saveError && (
                <Alert severity="error" sx={{ borderRadius: '8px', py: 0 }}>
                  {saveError}
                </Alert>
              )}
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <TextField
                  size="small"
                  label="Nome completo"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  required
                  autoFocus
                  sx={{ flex: 1 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  disabled={saving}
                  sx={{ textTransform: 'none', borderRadius: '8px', mt: 0.5, flexShrink: 0 }}
                >
                  {saving ? 'Salvando…' : 'Salvar'}
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setEditing(false);
                    setNameInput(name);
                    setSaveError('');
                  }}
                  sx={{ textTransform: 'none', color: tokens.text[2], mt: 0.5, flexShrink: 0 }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '1.25rem' }}>{name}</Typography>
              <Box
                sx={{
                  px: '8px',
                  py: '3px',
                  borderRadius: '6px',
                  bgcolor: `${roleColor}18`,
                  border: `1px solid ${roleColor}44`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.6875rem',
                    color: roleColor,
                    fontFamily: 'var(--f-mono)',
                    letterSpacing: '0.08em',
                  }}
                >
                  {ROLE_LABEL[role] ?? role}
                </Typography>
              </Box>
              {saved && <CheckIcon sx={{ fontSize: 18, color: 'success.main' }} />}
              <Button
                size="small"
                startIcon={<EditOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                onClick={() => setEditing(true)}
                sx={{ textTransform: 'none', fontSize: '0.75rem', color: tokens.text[2] }}
              >
                Editar
              </Button>
            </Box>
          )}
          {!editing && (
            <Typography sx={{ fontSize: '0.875rem', color: tokens.text[2] }}>{email}</Typography>
          )}
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
              sx={{
                fontFamily: 'var(--f-serif)',
                fontSize: 22,
                lineHeight: 1.1,
                mb: 0.5,
                wordBreak: 'break-word',
              }}
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

      {/* Account info */}
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
        {accountRows.map((row, i, arr) => (
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
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{row.value}</Typography>
            </Box>
            {i < arr.length - 1 && <Divider sx={{ borderColor: tokens.line.default }} />}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
