'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../store/useStore';
import { api } from '../../../services/api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { tokens } from '../../../lib/tokens';

export default function MinhasTrilhasPage() {
  const router = useRouter();
  const trails = useStore((s) => s.trails);
  const setTrails = useStore((s) => s.setTrails);
  const user = useStore((s) => s.user);
  const isAdmin = user?.role === 'admin';
  // Progress bars only make sense for students. Mentors and admins have no
  // personal completion state — showing 0% to them is a role-mapping error.
  const showProgress = user?.role === 'aluno';

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const trailToDelete = trails.find((t) => t.id === deleteId);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await api.deleteTrail(deleteId);
      setTrails(trails.filter((t) => t.id !== deleteId));
      setDeleteId(null);
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Erro ao excluir a trilha.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
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
            {isAdmin ? 'Gerenciar Trilhas' : 'Minhas Trilhas'}
          </Typography>
          <Typography sx={{ color: tokens.text[2], fontSize: '0.875rem' }}>
            {trails.length} trilha{trails.length !== 1 ? 's' : ''}
            {isAdmin ? ' cadastrada' : ' em andamento'}
            {trails.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {/* Admin: quick button to create new trail */}
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AdminPanelSettingsOutlinedIcon sx={{ fontSize: '16px !important' }} />}
            onClick={() => router.push('/admin/trails/new')}
            sx={{ textTransform: 'none', borderRadius: '10px', px: 2.5 }}
          >
            Nova Trilha
          </Button>
        )}
      </Box>

      {/* Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {trails.map((trail) => (
          <Box
            key={trail.id}
            onClick={() => !isAdmin && router.push(`/trilha/${trail.id}`)}
            sx={{
              bgcolor: tokens.bg[3],
              border: `1px solid ${isAdmin ? `${trail.color}55` : tokens.line.default}`,
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              cursor: isAdmin ? 'default' : 'pointer',
              transition: 'border-color 150ms, background 150ms',
              '&:hover': isAdmin ? {} : { borderColor: `${trail.color}55`, bgcolor: tokens.bg[4] },
            }}
          >
            {/* Admin top bar — replaces the subtle icons */}
            {isAdmin && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  bgcolor: `${trail.color}14`,
                  borderBottom: `1px solid ${trail.color}33`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <AdminPanelSettingsOutlinedIcon
                  sx={{ fontSize: 13, color: trail.color, flexShrink: 0 }}
                />
                <Typography
                  sx={{
                    fontSize: '0.6875rem',
                    color: trail.color,
                    fontFamily: 'var(--f-mono)',
                    letterSpacing: '0.06em',
                    flex: 1,
                  }}
                >
                  ADMIN
                </Typography>
                <Button
                  size="small"
                  startIcon={<EditOutlinedIcon sx={{ fontSize: '13px !important' }} />}
                  onClick={() => router.push(`/admin/trails/${trail.id}/edit`)}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    py: 0.25,
                    px: 1,
                    color: trail.color,
                    '&:hover': { bgcolor: `${trail.color}22` },
                  }}
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  startIcon={<DeleteOutlinedIcon sx={{ fontSize: '13px !important' }} />}
                  onClick={() => {
                    setDeleteId(trail.id);
                    setDeleteError('');
                  }}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    py: 0.25,
                    px: 1,
                    color: 'error.main',
                    '&:hover': { bgcolor: 'error.main' + '18' },
                  }}
                >
                  Excluir
                </Button>
              </Box>
            )}

            {/* Card body */}
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              {/* Color badge + level */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    bgcolor: `${trail.color}20`,
                    border: `1px solid ${trail.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box sx={{ width: 14, height: 14, borderRadius: '3px', bgcolor: trail.color }} />
                </Box>
                <Box
                  sx={{
                    px: '8px',
                    py: '3px',
                    borderRadius: '6px',
                    bgcolor: tokens.bg[0],
                    border: `1px solid ${tokens.line.default}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.6875rem',
                      color: tokens.text[2],
                      fontFamily: 'var(--f-mono)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {trail.level}
                  </Typography>
                </Box>
              </Box>

              {/* Title & subtitle */}
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '1.0625rem', mb: 0.5 }}>
                  {trail.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.8125rem',
                    color: tokens.text[2],
                    lineHeight: 1.45,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {trail.subtitle}
                </Typography>
              </Box>

              {/* Progress — students only */}
              {showProgress && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography sx={{ fontSize: '0.75rem', color: tokens.text[2] }}>
                      Progresso
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: trail.color,
                        fontFamily: 'var(--f-mono)',
                      }}
                    >
                      {trail.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={trail.progress}
                    sx={{
                      height: 5,
                      borderRadius: 3,
                      bgcolor: tokens.bg[0],
                      '& .MuiLinearProgress-bar': { bgcolor: trail.color, borderRadius: 3 },
                    }}
                  />
                </Box>
              )}

              {/* Meta + action */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  pt: 0.5,
                  borderTop: `1px solid ${tokens.line.default}`,
                }}
              >
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {showProgress ? (
                    // Students see their completion progress
                    <>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: tokens.text[2],
                        }}
                      >
                        <LayersOutlinedIcon sx={{ fontSize: 13 }} />
                        <Typography sx={{ fontSize: '0.75rem' }}>
                          {trail.lessonsDone}/{trail.lessonsTotal} desafios
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: tokens.text[2],
                        }}
                      >
                        <AccessTimeOutlinedIcon sx={{ fontSize: 13 }} />
                        <Typography sx={{ fontSize: '0.75rem' }}>{trail.hoursTotal}h</Typography>
                      </Box>
                    </>
                  ) : (
                    // Admin/Mentor see challenge count and estimated time only
                    <>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: tokens.text[2],
                        }}
                      >
                        <LayersOutlinedIcon sx={{ fontSize: 13 }} />
                        <Typography sx={{ fontSize: '0.75rem' }}>
                          {trail.lessonsTotal} desafios
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: tokens.text[2],
                        }}
                      >
                        <AccessTimeOutlinedIcon sx={{ fontSize: 13 }} />
                        <Typography sx={{ fontSize: '0.75rem' }}>{trail.hoursTotal}h</Typography>
                      </Box>
                    </>
                  )}
                </Box>

                {isAdmin ? (
                  /* Admin: navigate to edit page */
                  <Button
                    size="small"
                    variant="text"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/admin/trails/${trail.id}/edit`);
                    }}
                    sx={{
                      fontSize: '0.75rem',
                      color: trail.color,
                      textTransform: 'none',
                      p: 0,
                      minWidth: 0,
                      '&:hover': { bgcolor: 'transparent', opacity: 0.8 },
                    }}
                  >
                    Gerenciar →
                  </Button>
                ) : (
                  /* Student/Mentor: continue */
                  <Button
                    size="small"
                    variant="text"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: '11px !important' }} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/trilha/${trail.id}`);
                    }}
                    sx={{
                      fontSize: '0.75rem',
                      color: trail.color,
                      textTransform: 'none',
                      p: 0,
                      minWidth: 0,
                      '&:hover': { bgcolor: 'transparent', opacity: 0.8 },
                    }}
                  >
                    Continuar
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteId}
        onClose={() => !deleting && setDeleteId(null)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              bgcolor: tokens.bg[3],
              border: `1px solid ${tokens.line.default}`,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: 'var(--f-serif)', fontWeight: 400, fontSize: '1.375rem' }}>
          Excluir trilha?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '0.9rem', color: tokens.text[2] }}>
            A trilha <strong style={{ color: 'inherit' }}>{trailToDelete?.title}</strong> e todos os
            seus desafios serão removidos permanentemente.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: '10px' }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setDeleteId(null)}
            disabled={deleting}
            sx={{ textTransform: 'none', color: tokens.text[2] }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleting}
            sx={{ textTransform: 'none', borderRadius: '8px' }}
          >
            {deleting ? 'Excluindo…' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
