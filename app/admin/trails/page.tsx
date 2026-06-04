'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../store/useStore';
import { api } from '../../../services/api';
import { tokens } from '../../../lib/tokens';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

export default function AdminTrailsPage() {
  const router = useRouter();
  const trails = useStore((s) => s.trails);
  const setTrails = useStore((s) => s.setTrails);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const trailToDelete = trails.find((t) => t.id === deleteId);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    setError('');
    try {
      await api.deleteTrail(deleteId);
      setTrails(trails.filter((t) => t.id !== deleteId));
      setDeleteId(null);
    } catch {
      setError('Esta trilha possui submissões e não pode ser excluída.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            Console de Trilhas
          </Typography>
          <Typography sx={{ color: tokens.text[2], fontSize: '0.875rem' }}>
            {trails.length} trilha{trails.length !== 1 ? 's' : ''} cadastrada
            {trails.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/admin/trails/new')}
          sx={{ borderRadius: '10px', textTransform: 'none', px: 2.5 }}
        >
          Nova Trilha
        </Button>
      </Box>

      {/* Trail list */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {trails.length === 0 && (
          <Box
            sx={{
              p: 5,
              textAlign: 'center',
              bgcolor: tokens.bg[3],
              border: `1px solid ${tokens.line.default}`,
              borderRadius: '16px',
            }}
          >
            <Typography sx={{ color: tokens.text[2], fontSize: '0.9rem' }}>
              Nenhuma trilha cadastrada ainda.
            </Typography>
          </Box>
        )}

        {trails.map((trail) => (
          <Box
            key={trail.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2.5,
              bgcolor: tokens.bg[3],
              border: `1px solid ${tokens.line.default}`,
              borderRadius: '14px',
              transition: 'border-color 120ms',
              '&:hover': { borderColor: tokens.line.strong },
            }}
          >
            {/* Color indicator */}
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: `${trail.color}20`,
                border: `1px solid ${trail.color}44`,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ width: 14, height: 14, borderRadius: '3px', bgcolor: trail.color }} />
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                  {trail.title}
                </Typography>
                <Chip
                  label={trail.level}
                  size="small"
                  sx={{
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--f-mono)',
                    height: 20,
                    bgcolor: tokens.bg[0],
                    border: `1px solid ${tokens.line.default}`,
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  color: tokens.text[2],
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {trail.subtitle}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 0.75 }}>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: tokens.text[3] }}
                >
                  <LayersOutlinedIcon sx={{ fontSize: 12 }} />
                  <Typography sx={{ fontSize: '0.6875rem', fontFamily: 'var(--f-mono)' }}>
                    {trail.lessonsTotal} desafios
                  </Typography>
                </Box>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: tokens.text[3] }}
                >
                  <AccessTimeOutlinedIcon sx={{ fontSize: 12 }} />
                  <Typography sx={{ fontSize: '0.6875rem', fontFamily: 'var(--f-mono)' }}>
                    {trail.hoursTotal}h estimadas
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
              <IconButton
                size="small"
                title="Editar trilha"
                onClick={() => router.push(`/admin/trails/${trail.id}/edit`)}
                sx={{
                  color: tokens.text[2],
                  borderRadius: '8px',
                  '&:hover': { color: 'primary.main', bgcolor: tokens.bg[4] },
                }}
              >
                <EditOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                title="Excluir trilha"
                onClick={() => {
                  setDeleteId(trail.id);
                  setError('');
                }}
                sx={{
                  color: tokens.text[2],
                  borderRadius: '8px',
                  '&:hover': { color: 'error.main', bgcolor: 'error.main' + '14' },
                }}
              >
                <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Delete confirmation dialog */}
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
            seus desafios serão removidos permanentemente. Esta ação não pode ser desfeita.
          </DialogContentText>
          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: '10px' }}>
              {error}
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
