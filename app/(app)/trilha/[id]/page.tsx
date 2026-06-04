'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '../../../../store/useStore';
import { api } from '../../../../services/api';
import { parseGitHubUrl, isValidGitHubUrl, extractYouTubeId } from '../../../../lib/github';
import type { Challenge } from '../../../../types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import InputBase from '@mui/material/InputBase';
import Alert from '@mui/material/Alert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import LinkIcon from '@mui/icons-material/Link';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { tokens } from '../../../../lib/tokens';
import { SocraticChat } from '../../../../components/ai/SocraticChat';

// ── Status helpers ────────────────────────────────────────────────────────────

type SubmissionStatus = 'Submitted' | 'Approved' | 'NeedsRevision';

function statusConfig(s: SubmissionStatus | null) {
  switch (s) {
    case 'Approved':
      return {
        label: 'Aprovado',
        color: 'primary.main',
        bg: tokens.orange.soft,
        ring: tokens.orange.ring,
        Icon: CheckCircleIcon,
      };
    case 'NeedsRevision':
      return {
        label: 'Revisão necessária',
        color: 'error.main',
        bg: 'rgba(248,113,113,0.12)',
        ring: 'rgba(248,113,113,0.35)',
        Icon: RefreshIcon,
      };
    case 'Submitted':
      return {
        label: 'Aguardando revisão',
        color: tokens.violet.main,
        bg: tokens.violet.soft,
        ring: tokens.violet.ring,
        Icon: RadioButtonUncheckedIcon,
      };
    default:
      return {
        label: 'Pendente',
        color: tokens.text[2],
        bg: 'transparent',
        ring: tokens.line.default,
        Icon: RadioButtonUncheckedIcon,
      };
  }
}

// ── YouTube embed ─────────────────────────────────────────────────────────────

function YouTubeEmbed({ url }: { url: string }) {
  const [open, setOpen] = useState(false);
  const id = extractYouTubeId(url);
  if (!id) return null;

  return (
    <Box>
      <Button
        size="small"
        startIcon={<PlayCircleIcon sx={{ fontSize: '15px !important', color: '#FF0000' }} />}
        onClick={() => setOpen((v) => !v)}
        sx={{
          textTransform: 'none',
          color: tokens.text[2],
          fontSize: '0.8125rem',
          pl: 0,
          '&:hover': { color: 'text.primary' },
        }}
      >
        {open ? 'Fechar tutorial' : 'Assistir tutorial'}
      </Button>
      <Collapse in={open}>
        <Box
          sx={{
            mt: 1.5,
            borderRadius: '10px',
            overflow: 'hidden',
            aspectRatio: '16/9',
            bgcolor: '#000',
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Tutorial"
          />
        </Box>
      </Collapse>
    </Box>
  );
}

// ── Inline submission field ───────────────────────────────────────────────────

interface SubmitFieldProps {
  challenge: Challenge;
  onSubmitted: (updated: Challenge) => void;
}

function SubmitField({ challenge, onSubmitted }: SubmitFieldProps) {
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const info = parseGitHubUrl(url);
  const valid = info.kind !== 'invalid';

  const isResubmit = challenge.lastSubmissionStatus === 'NeedsRevision';
  const previousUrl = challenge.lastSubmissionAt ? url : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();

    // Guard: empty field
    if (!trimmed) {
      setError('Cole o link do seu repositório ou Gist para entregar.');
      return;
    }

    // Guard: invalid GitHub URL pattern
    if (!valid) {
      setError(
        'Link inválido. Use o formato github.com/usuário/repositório ou gist.github.com/usuário/id.'
      );
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await api.createSubmission({ challengeId: challenge.id, gitHubUrl: trimmed });
      onSubmitted({
        ...challenge,
        lastSubmissionAt: new Date().toISOString(),
        lastSubmissionStatus: 'Submitted',
      });
      setUrl('');
    } catch (err: unknown) {
      // Surface user-friendly message; swallow raw backend validation noise
      const msg = err instanceof Error ? err.message : '';
      setError(
        msg && !msg.toLowerCase().includes('validation')
          ? msg
          : 'Não foi possível enviar. Verifique o link e tente novamente.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
    >
      {error && (
        <Alert severity="error" sx={{ borderRadius: '8px', py: 0, fontSize: '0.8125rem' }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 1,
          borderRadius: '10px',
          bgcolor: tokens.bg[0],
          border: `1px solid ${url && valid ? tokens.orange.ring : url ? 'rgba(248,113,113,0.4)' : tokens.line.strong}`,
          transition: 'border-color 150ms',
          '&:focus-within': { borderColor: valid ? tokens.orange.ring : 'rgba(248,113,113,0.4)' },
        }}
      >
        <LinkIcon sx={{ fontSize: 16, color: tokens.text[2], flexShrink: 0 }} />
        <InputBase
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError('');
          }}
          placeholder={
            isResubmit
              ? 'Cole o link corrigido (github.com/…)'
              : 'https://github.com/usuário/repositório'
          }
          sx={{
            flex: 1,
            fontSize: '0.875rem',
            color: 'text.primary',
            '& input::placeholder': { color: tokens.text[2] },
          }}
        />
        {/* Real-time type badge */}
        {url && (
          <Chip
            label={valid ? (info.kind === 'gist' ? 'gist' : 'repo') : 'URL inválida'}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.6875rem',
              fontFamily: 'var(--f-mono)',
              bgcolor: valid ? tokens.orange.soft : 'rgba(248,113,113,0.12)',
              color: valid ? 'primary.main' : 'error.main',
              border: `1px solid ${valid ? tokens.orange.ring : 'rgba(248,113,113,0.4)'}`,
              flexShrink: 0,
            }}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={submitting || !valid}
          startIcon={
            isResubmit ? (
              <RefreshIcon sx={{ fontSize: '14px !important' }} />
            ) : (
              <AssignmentOutlinedIcon sx={{ fontSize: '14px !important' }} />
            )
          }
          sx={{ textTransform: 'none', borderRadius: '8px', px: 2 }}
        >
          {submitting ? 'Enviando…' : isResubmit ? 'Reenviar' : 'Entregar'}
        </Button>
      </Box>
    </Box>
  );
}

// ── Challenge card ─────────────────────────────────────────────────────────────

interface ChallengeCardProps {
  challenge: Challenge;
  index: number;
  isStudent: boolean;
  onSubmitted: (updated: Challenge) => void;
}

function ChallengeCard({ challenge, index, isStudent, onSubmitted }: ChallengeCardProps) {
  const status = challenge.lastSubmissionStatus;
  const cfg = statusConfig(status);
  const [open, setOpen] = useState(index === 0);

  const needsRevision = status === 'NeedsRevision';
  const approved = status === 'Approved';
  const submitted = status === 'Submitted';

  return (
    <Box
      sx={{
        bgcolor: tokens.bg[3],
        border: `1px solid ${approved ? tokens.orange.ring : needsRevision ? 'rgba(248,113,113,0.4)' : submitted ? tokens.violet.ring : tokens.line.default}`,
        borderRadius: '14px',
        mb: 1.5,
        overflow: 'hidden',
      }}
    >
      {/* Clickable header row */}
      <Box
        component="button"
        onClick={() => setOpen((v) => !v)}
        sx={{
          width: '100%',
          p: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          textAlign: 'left',
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.025)' },
        }}
      >
        {/* Status icon */}
        <Box sx={{ flexShrink: 0, color: approved ? 'primary.main' : cfg.color }}>
          {approved ? (
            <CheckCircleIcon sx={{ fontSize: 22, color: 'primary.main' }} />
          ) : needsRevision ? (
            <RefreshIcon sx={{ fontSize: 22, color: 'error.main' }} />
          ) : submitted ? (
            <RadioButtonUncheckedIcon sx={{ fontSize: 22, color: tokens.violet.main }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ fontSize: 22, color: tokens.text[2] }} />
          )}
        </Box>

        {/* Order badge */}
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '9px',
            flexShrink: 0,
            bgcolor: cfg.bg,
            border: `1px solid ${cfg.ring}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--f-mono)',
            fontSize: 12,
            fontWeight: 700,
            color: cfg.color,
          }}
        >
          {String(challenge.order).padStart(2, '0')}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {challenge.title}
            </Typography>
            <Chip
              label={cfg.label}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.6875rem',
                fontFamily: 'var(--f-mono)',
                border: '1px solid',
                bgcolor: cfg.bg,
                borderColor: cfg.ring,
                color: cfg.color,
              }}
            />
          </Box>
          {challenge.lastSubmissionAt && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 12, color: tokens.text[2] }} />
              <Typography sx={{ fontSize: 12, color: tokens.text[2] }}>
                {needsRevision ? 'Revisão em ' : 'Enviado em '}
                {new Date(challenge.lastSubmissionAt).toLocaleDateString('pt-BR')}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ color: tokens.text[2], flexShrink: 0 }}>
          {open ? (
            <ExpandLessIcon sx={{ fontSize: 18 }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 18 }} />
          )}
        </Box>
      </Box>

      {/* Expanded body */}
      <Collapse in={open}>
        <Box
          sx={{
            px: '22px',
            pb: '20px',
            borderTop: `1px solid ${tokens.line.default}`,
            pt: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography sx={{ fontSize: '0.875rem', color: tokens.text[2], lineHeight: 1.65 }}>
            {challenge.description}
          </Typography>

          {/* YouTube tutorial */}
          {challenge.youTubeUrl && <YouTubeEmbed url={challenge.youTubeUrl} />}

          {/* Mentor comment — shown when there's feedback */}
          {challenge.mentorComment && (
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                p: 1.5,
                borderRadius: '10px',
                bgcolor: needsRevision ? 'rgba(248,113,113,0.08)' : tokens.orange.soft,
                border: `1px solid ${needsRevision ? 'rgba(248,113,113,0.3)' : tokens.orange.ring}`,
              }}
            >
              <Box sx={{ fontSize: 18, flexShrink: 0 }}>{needsRevision ? '💬' : '✅'}</Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: needsRevision ? 'error.main' : 'primary.main',
                    fontFamily: 'var(--f-mono)',
                    mb: 0.25,
                  }}
                >
                  {challenge.mentorComment}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Submission field — shown to students who haven't been approved */}
          {isStudent && !approved && (
            <SubmitField challenge={challenge} onSubmitted={onSubmitted} />
          )}

          {approved && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography sx={{ fontSize: '0.8125rem', color: 'primary.main', fontWeight: 600 }}>
                Desafio concluído — bom trabalho!
              </Typography>
            </Box>
          )}

          {/* Socratic AI tutor — students only, on any non-approved challenge */}
          {isStudent && !approved && (
            <SocraticChat challengeId={challenge.id} challengeTitle={challenge.title} />
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TrilhaPage() {
  const params = useParams();
  const id = params?.id as string;
  const challengesRef = useRef<HTMLDivElement>(null);

  const user = useStore((s) => s.user);
  const trails = useStore((s) => s.trails);
  const updateTrailProgress = useStore((s) => s.updateTrailProgress);
  const trail = trails.find((t) => t.id === id);
  const isStudent = user?.role === 'aluno';

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoadingChallenges(true);
    api
      .getTrailChallenges(id)
      .then((c) => {
        setChallenges(c);
        // Propagate real progress into the store so dashboard/progress page
        // reflects actual completion instead of the hardcoded 0.
        const approved = c.filter((ch) => ch.lastSubmissionStatus === 'Approved').length;
        updateTrailProgress(id, approved, c.length);
      })
      .catch(() => {})
      .finally(() => setLoadingChallenges(false));
    if (isStudent)
      api
        .getEnrollment(id)
        .then((e) => setEnrolled(e.enrolled))
        .catch(() => {});
  }, [id, isStudent, updateTrailProgress]);

  function handleSubmitted(updated: Challenge) {
    setChallenges((prev) => {
      const next = prev.map((c) => (c.id === updated.id ? updated : c));
      // Re-sync progress whenever a submission is recorded
      const approved = next.filter((c) => c.lastSubmissionStatus === 'Approved').length;
      updateTrailProgress(id, approved, next.length);
      return next;
    });
  }

  async function handleEnroll() {
    setEnrolling(true);
    try {
      await api.enrollTrail(id);
      setEnrolled(true);
    } catch {
    } finally {
      setEnrolling(false);
    }
  }

  if (!trail) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  const approvedCount = challenges.filter((c) => c.lastSubmissionStatus === 'Approved').length;
  const progressPct =
    challenges.length > 0 ? Math.round((approvedCount / challenges.length) * 100) : 0;
  const firstPending = challenges.find((c) => c.lastSubmissionStatus !== 'Approved');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
          gap: 3,
          alignItems: 'end',
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: 'primary.main',
              letterSpacing: '0.10em',
              display: 'block',
              mb: 0.75,
              textTransform: 'uppercase',
            }}
          >
            {trail.level}
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: 'var(--f-serif)',
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 400,
              lineHeight: 1.15,
              mb: 0.75,
            }}
          >
            {trail.title}
          </Typography>
          <Typography sx={{ color: tokens.text[2], fontSize: '0.9rem' }}>
            {trail.subtitle}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0, flexWrap: 'wrap' }}>
          {isStudent && !enrolled && (
            <Button
              variant="outlined"
              startIcon={<SchoolOutlinedIcon />}
              onClick={handleEnroll}
              disabled={enrolling}
              sx={{
                borderColor: tokens.line.default,
                color: tokens.text[2],
                textTransform: 'none',
                '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
              }}
            >
              {enrolling ? 'Inscrevendo…' : 'Inscrever-se'}
            </Button>
          )}
          {isStudent && enrolled && (
            <Chip
              label="✓ Inscrito"
              sx={{
                bgcolor: tokens.orange.soft,
                border: `1px solid ${tokens.orange.ring}`,
                color: 'primary.main',
                fontFamily: 'var(--f-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            />
          )}
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={() => challengesRef.current?.scrollIntoView({ behavior: 'smooth' })}
            disabled={challenges.length === 0}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {firstPending ? 'Próximo desafio' : 'Ver desafios'}
          </Button>
        </Box>
      </Box>

      {/* Stats — 3 real metrics, no placeholder AI card */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 1.75,
        }}
      >
        {[
          {
            label: 'Progresso',
            value: `${progressPct}%`,
            sub: (
              <LinearProgress
                variant="determinate"
                value={progressPct}
                sx={{
                  mt: 1.5,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: tokens.bg[0],
                  '& .MuiLinearProgress-bar': { borderRadius: 2 },
                }}
              />
            ),
          },
          {
            label: 'Desafios',
            value: loadingChallenges ? '—' : `${approvedCount}/${challenges.length}`,
            sub: (
              <Typography sx={{ fontSize: 12, color: tokens.text[2], mt: 1.5 }}>
                aprovados
              </Typography>
            ),
          },
          {
            label: 'Tempo estimado',
            value: `${trail.hoursTotal}h`,
            sub: (
              <Typography sx={{ fontSize: 12, color: tokens.text[2], mt: 1.5 }}>
                para concluir
              </Typography>
            ),
          },
        ].map((s) => (
          <Box
            key={s.label}
            sx={{
              p: 2.5,
              bgcolor: tokens.bg[3],
              border: `1px solid ${tokens.line.default}`,
              borderRadius: '14px',
            }}
          >
            <Typography
              sx={{
                fontSize: 10,
                color: tokens.text[2],
                fontFamily: 'var(--f-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                mb: 1,
              }}
            >
              {s.label}
            </Typography>
            <Typography sx={{ fontFamily: 'var(--f-serif)', fontSize: 28, lineHeight: 1 }}>
              {s.value}
            </Typography>
            {s.sub}
          </Box>
        ))}
      </Box>

      {/* Challenges */}
      <Box ref={challengesRef}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Typography sx={{ fontFamily: 'var(--f-serif)', fontSize: 22, whiteSpace: 'nowrap' }}>
            {loadingChallenges
              ? '…'
              : `${challenges.length} desafio${challenges.length !== 1 ? 's' : ''}`}
          </Typography>
          <Box sx={{ flex: 1, height: '1px', bgcolor: tokens.line.default }} />
          {!loadingChallenges && challenges.length > 0 && (
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: tokens.text[2],
                fontFamily: 'var(--f-mono)',
                flexShrink: 0,
              }}
            >
              {approvedCount}/{challenges.length} aprovados
            </Typography>
          )}
        </Box>

        {loadingChallenges ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress size={28} />
          </Box>
        ) : challenges.length === 0 ? (
          <Box
            sx={{
              py: 5,
              textAlign: 'center',
              bgcolor: tokens.bg[3],
              border: `1px solid ${tokens.line.default}`,
              borderRadius: '14px',
            }}
          >
            <AssignmentOutlinedIcon sx={{ fontSize: 36, color: tokens.text[3], mb: 1 }} />
            <Typography sx={{ color: tokens.text[2], fontSize: '0.9rem' }}>
              Nenhum desafio cadastrado ainda.
            </Typography>
          </Box>
        ) : (
          challenges.map((c, i) => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              index={i}
              isStudent={isStudent}
              onSubmitted={handleSubmitted}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
