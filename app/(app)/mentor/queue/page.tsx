'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../../services/api';
import { parseGitHubUrl } from '../../../../lib/github';
import type { Submission } from '../../../../services/api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { tokens } from '../../../../lib/tokens';
import type { AiReviewDraft } from '../../../../services/api';

// ── Time helper ───────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'agora';
  if (m < 60) return `${m}min atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  return `${Math.floor(h / 24)}d atrás`;
}

// ── Submission card ───────────────────────────────────────────────────────────

interface CardProps {
  submission: Submission;
  onReviewed: (id: string) => void;
}

function SubmissionCard({ submission: s, onReviewed }: CardProps) {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState<'Approved' | 'NeedsRevision' | null>(null);
  const [error, setError] = useState('');
  const [commentOpen, setCommentOpen] = useState(false);

  // AI review draft state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDraft, setAiDraft] = useState<AiReviewDraft | null>(null);
  const [aiError, setAiError] = useState('');

  const ghInfo = parseGitHubUrl(s.gitHubUrl);

  async function loadAiDraft() {
    setAiLoading(true);
    setAiError('');
    setAiDraft(null);
    try {
      const draft = await api.getReviewDraft(s.id);
      setAiDraft(draft);
      // Pre-fill comment field with AI suggestion — mentor can edit before submitting
      setComment(draft.suggestedComment);
      setCommentOpen(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao gerar análise.';
      setAiError(
        msg.includes('503') || msg.includes('not configured')
          ? 'IA não configurada. Adicione a chave Anthropic:ApiKey no servidor.'
          : msg
      );
    } finally {
      setAiLoading(false);
    }
  }

  async function decide(decision: 'Approved' | 'NeedsRevision') {
    setSubmitting(decision);
    setError('');
    try {
      await api.reviewSubmission(s.id, { decision, comment: comment.trim() || undefined });
      // Reset local state before removing the card so no stale comment bleeds
      // into a subsequent card that might mount in its place.
      setComment('');
      setCommentOpen(false);
      onReviewed(s.id);
    } catch (err: unknown) {
      // Never show raw ASP.NET validation messages to the user.
      // "One or more validation errors occurred." is internal — translate it.
      const raw = err instanceof Error ? err.message : '';
      const isValidationNoise =
        !raw ||
        raw.toLowerCase().includes('validation') ||
        raw.toLowerCase().includes('one or more');
      setError(
        isValidationNoise
          ? 'Não foi possível salvar a revisão. Verifique o comentário e tente novamente.'
          : raw
      );
      setSubmitting(null);
    }
  }

  return (
    <Box
      sx={{
        bgcolor: tokens.bg[3],
        border: `1px solid ${tokens.line.default}`,
        borderRadius: '14px',
        overflow: 'hidden',
        transition: 'border-color 140ms',
        '&:hover': { borderColor: tokens.line.strong },
      }}
    >
      {/* Card header */}
      <Box sx={{ px: 3, pt: 2.5, pb: 2, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        {/* Avatar initials */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            flexShrink: 0,
            bgcolor: tokens.violet.soft,
            border: `1px solid ${tokens.violet.ring}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: tokens.violet.main,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {s.studentName
            .split(' ')
            .slice(0, 2)
            .map((w) => w[0].toUpperCase())
            .join('')}
        </Box>

        {/* Student + activity info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.25 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>{s.studentName}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: tokens.text[2] }}>
              <AccessTimeOutlinedIcon sx={{ fontSize: 12 }} />
              <Typography
                sx={{ fontSize: '0.75rem', fontFamily: 'var(--f-mono)', color: tokens.text[2] }}
              >
                {timeAgo(s.submittedAt)}
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ fontSize: '0.8125rem', color: tokens.text[2] }}>
            {s.challengeTitle}
            {s.trailName && (
              <Box component="span" sx={{ color: tokens.text[3] }}>
                {' '}
                · {s.trailName}
              </Box>
            )}
          </Typography>
        </Box>
      </Box>

      {/* GitHub link row */}
      <Box
        sx={{
          mx: 3,
          mb: 2,
          px: 2,
          py: 1.25,
          bgcolor: tokens.bg[0],
          border: `1px solid ${tokens.line.default}`,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Chip
          label={ghInfo.kind === 'gist' ? 'gist' : 'repo'}
          size="small"
          sx={{
            height: 20,
            fontSize: '0.6875rem',
            fontFamily: 'var(--f-mono)',
            bgcolor: tokens.orange.soft,
            border: `1px solid ${tokens.orange.ring}`,
            color: 'primary.main',
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            flex: 1,
            fontSize: '0.8125rem',
            color: tokens.text[2],
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {ghInfo.label || s.gitHubUrl}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          href={s.gitHubUrl}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNewOutlinedIcon sx={{ fontSize: '12px !important' }} />}
          sx={{
            textTransform: 'none',
            fontSize: '0.75rem',
            borderRadius: '7px',
            flexShrink: 0,
            borderColor: tokens.line.strong,
            color: tokens.text[2],
            '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
          }}
        >
          Abrir código
        </Button>
      </Box>

      {/* Inline comment + action buttons */}
      <Box sx={{ px: 3, pb: 2.5, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {error && (
          <Alert severity="error" sx={{ borderRadius: '8px', py: 0, fontSize: '0.8125rem' }}>
            {error}
          </Alert>
        )}

        {/* ── AI Co-Pilot ─────────────────────────────────────────────────── */}
        <Box>
          <Button
            size="small"
            startIcon={
              aiLoading ? (
                <CircularProgress size={12} sx={{ color: tokens.violet.main }} />
              ) : (
                <AutoAwesomeIcon sx={{ fontSize: '14px !important', color: tokens.violet.main }} />
              )
            }
            disabled={aiLoading}
            onClick={loadAiDraft}
            sx={{ textTransform: 'none', color: tokens.violet.main, fontSize: '0.75rem', pl: 0 }}
          >
            {aiLoading ? 'Analisando código…' : 'Analisar com IA'}
          </Button>

          {aiError && (
            <Alert
              severity="warning"
              sx={{ mt: 1, borderRadius: '8px', py: 0.5, fontSize: '0.75rem' }}
            >
              {aiError}
            </Alert>
          )}

          {aiDraft && (
            <Box
              sx={{
                mt: 1,
                p: 1.5,
                borderRadius: '10px',
                bgcolor: tokens.violet.soft,
                border: `1px solid ${tokens.violet.ring}`,
              }}
            >
              <Typography
                sx={{ fontSize: '0.75rem', fontWeight: 600, color: tokens.violet.main, mb: 0.5 }}
              >
                Análise da IA — edite antes de enviar
              </Typography>
              <Typography
                sx={{ fontSize: '0.8125rem', color: tokens.text[2], lineHeight: 1.55, mb: 1 }}
              >
                {aiDraft.qualityAnalysis}
              </Typography>
              {aiDraft.edgeCases.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: '0.6875rem',
                      color: tokens.violet.main,
                      fontFamily: 'var(--f-mono)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    Edge cases
                  </Typography>
                  {aiDraft.edgeCases.map((ec, i) => (
                    <Typography key={i} sx={{ fontSize: '0.8125rem', color: tokens.text[2] }}>
                      · {ec}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Optional comment field (pre-filled by AI draft when available) */}
        <Box
          sx={{
            px: 2,
            py: 1,
            borderRadius: '8px',
            bgcolor: tokens.bg[0],
            border: `1px solid ${commentOpen ? tokens.line.strong : tokens.line.default}`,
            transition: 'border-color 120ms',
          }}
        >
          <InputBase
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onFocus={() => setCommentOpen(true)}
            onBlur={() => !comment && setCommentOpen(false)}
            placeholder="Comentário opcional (max 500 chars)…"
            multiline={commentOpen}
            rows={commentOpen ? 2 : 1}
            fullWidth
            sx={{
              fontSize: '0.8125rem',
              color: 'text.primary',
              '& textarea::placeholder, & input::placeholder': { color: tokens.text[2] },
            }}
          />
        </Box>

        {/* Binary decision buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            startIcon={
              submitting === 'NeedsRevision' ? <CircularProgress size={14} /> : <RefreshIcon />
            }
            disabled={!!submitting}
            onClick={() => decide('NeedsRevision')}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              borderColor: 'rgba(248,113,113,0.4)',
              color: 'error.main',
              '&:hover': { bgcolor: 'rgba(248,113,113,0.08)', borderColor: 'error.main' },
            }}
          >
            Precisa de revisão
          </Button>
          <Button
            variant="contained"
            size="small"
            fullWidth
            startIcon={
              submitting === 'Approved' ? (
                <CircularProgress size={14} sx={{ color: '#fff' }} />
              ) : (
                <CheckCircleOutlinedIcon />
              )
            }
            disabled={!!submitting}
            onClick={() => decide('Approved')}
            sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600 }}
          >
            Aprovado ✓
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MentorQueuePage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getSubmissions()
      .then(setSubmissions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleReviewed(id: string) {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  }

  const pending = submissions.filter((s) => s.status === 'Submitted');

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
          Fila de Revisão
        </Typography>
        <Typography sx={{ color: tokens.text[2], fontSize: '0.875rem' }}>
          {loading
            ? 'Carregando…'
            : pending.length === 0
              ? 'Nenhuma submissão pendente.'
              : `${pending.length} entrega${pending.length !== 1 ? 's' : ''} aguardando revisão`}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={28} />
        </Box>
      ) : pending.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            bgcolor: tokens.bg[3],
            border: `1px solid ${tokens.line.default}`,
            borderRadius: '16px',
          }}
        >
          <CheckCircleOutlinedIcon sx={{ fontSize: 48, color: tokens.text[3], mb: 1.5 }} />
          <Typography sx={{ fontFamily: 'var(--f-serif)', fontSize: '1.25rem', mb: 0.5 }}>
            Tudo em dia!
          </Typography>
          <Typography sx={{ color: tokens.text[2], fontSize: '0.875rem' }}>
            Nenhuma entrega aguarda revisão no momento.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {pending.map((s) => (
            <SubmissionCard key={s.id} submission={s} onReviewed={handleReviewed} />
          ))}
        </Box>
      )}

      {/* Non-pending summary */}
      {!loading && submissions.length > pending.length && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            p: 2,
            bgcolor: tokens.bg[3],
            border: `1px solid ${tokens.line.default}`,
            borderRadius: '12px',
          }}
        >
          {[
            {
              label: 'Aprovadas',
              count: submissions.filter((s) => s.status === 'Approved').length,
              color: 'primary.main',
            },
            {
              label: 'Em revisão',
              count: submissions.filter((s) => s.status === 'NeedsRevision').length,
              color: 'error.main',
            },
          ].map((stat) => (
            <Box key={stat.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                sx={{
                  fontFamily: 'var(--f-mono)',
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  color: stat.color,
                }}
              >
                {stat.count}
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: tokens.text[2] }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
