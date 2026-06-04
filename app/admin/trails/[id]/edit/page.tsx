'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../../store/useStore';
import { api } from '../../../../../services/api';
import { tokens } from '../../../../../lib/tokens';
import type { Challenge } from '../../../../../types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CheckIcon from '@mui/icons-material/Check';

interface Params {
  id: string;
}

const paperSlot = (bg: string, border: string) => ({
  paper: { sx: { borderRadius: '16px', bgcolor: bg, border } },
});

export default function EditTrailPage({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const router = useRouter();
  const setTrails = useStore((s) => s.setTrails);
  const storeTrail = useStore((s) => s.trails.find((t) => t.id === id));

  // ── Trail details ──────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [savingTrail, setSavingTrail] = useState(false);
  const [trailSaved, setTrailSaved] = useState(false);
  const [trailError, setTrailError] = useState('');

  // ── Challenges ─────────────────────────────────────────────────────────────
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);

  // Add form
  const [showAddForm, setShowAddForm] = useState(false);
  const [addTitle, setAddTitle] = useState('');
  const [addDesc, setAddDesc] = useState('');
  const [addOrder, setAddOrder] = useState(1);
  const [addingChallenge, setAddingChallenge] = useState(false);
  const [addError, setAddError] = useState('');

  // Edit dialog
  const [editChallenge, setEditChallenge] = useState<Challenge | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editOrder, setEditOrder] = useState(1);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete dialog
  const [deleteChallId, setDeleteChallId] = useState<string | null>(null);
  const [deletingChall, setDeletingChall] = useState(false);
  const [deleteChallError, setDeleteChallError] = useState('');

  // ── Bootstrap ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (storeTrail) {
      setName(storeTrail.title);
      setDescription(storeTrail.subtitle);
    } else {
      api
        .getTrailById(id)
        .then((raw) => {
          setName(raw.name);
          setDescription(raw.description);
        })
        .catch(() => router.replace('/admin/trails'));
    }
  }, [id, storeTrail, router]);

  useEffect(() => {
    setLoadingChallenges(true);
    api
      .getTrailChallenges(id)
      .then((c) => {
        setChallenges(c);
        setAddOrder(c.length + 1);
      })
      .catch(() => {})
      .finally(() => setLoadingChallenges(false));
  }, [id]);

  // ── Trail save ─────────────────────────────────────────────────────────────

  async function handleSaveTrail(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    setSavingTrail(true);
    setTrailError('');
    setTrailSaved(false);
    try {
      await api.updateTrail(id, { name: name.trim(), description: description.trim() });
      setTrails(await api.getTrails());
      setTrailSaved(true);
      setTimeout(() => setTrailSaved(false), 2000);
    } catch {
      setTrailError('Não foi possível salvar. Tente novamente.');
    } finally {
      setSavingTrail(false);
    }
  }

  // ── Add challenge ──────────────────────────────────────────────────────────

  async function handleAddChallenge(e: React.FormEvent) {
    e.preventDefault();
    if (!addTitle.trim() || !addDesc.trim()) return;
    setAddingChallenge(true);
    setAddError('');
    try {
      const created = await api.addChallenge(id, {
        title: addTitle.trim(),
        description: addDesc.trim(),
        order: addOrder,
      });
      setChallenges((prev) => [...prev, created].sort((a, b) => a.order - b.order));
      setAddTitle('');
      setAddDesc('');
      setAddOrder(challenges.length + 2);
      setShowAddForm(false);
    } catch {
      setAddError('Não foi possível adicionar o desafio.');
    } finally {
      setAddingChallenge(false);
    }
  }

  // ── Edit challenge ─────────────────────────────────────────────────────────

  function openEdit(c: Challenge) {
    setEditChallenge(c);
    setEditTitle(c.title);
    setEditDesc(c.description);
    setEditOrder(c.order);
    setEditError('');
  }

  async function handleEditChallenge(e: React.FormEvent) {
    e.preventDefault();
    if (!editChallenge || !editTitle.trim() || !editDesc.trim()) return;
    setSavingEdit(true);
    setEditError('');
    try {
      const updated = await api.updateChallenge(id, editChallenge.id, {
        title: editTitle.trim(),
        description: editDesc.trim(),
        order: editOrder,
      });
      setChallenges((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)).sort((a, b) => a.order - b.order)
      );
      setEditChallenge(null);
    } catch {
      setEditError('Não foi possível salvar o desafio.');
    } finally {
      setSavingEdit(false);
    }
  }

  // ── Delete challenge ───────────────────────────────────────────────────────

  async function handleDeleteChallenge() {
    if (!deleteChallId) return;
    setDeletingChall(true);
    setDeleteChallError('');
    try {
      await api.deleteChallenge(id, deleteChallId);
      setChallenges((prev) => prev.filter((c) => c.id !== deleteChallId));
      setDeleteChallId(null);
    } catch {
      setDeleteChallError('Este desafio possui submissões e não pode ser excluído.');
    } finally {
      setDeletingChall(false);
    }
  }

  const challToDelete = challenges.find((c) => c.id === deleteChallId);
  const paperStyle = `1px solid ${tokens.line.default}`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 720 }}>
      {/* Header */}
      <Box>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: '14px !important' }} />}
          onClick={() => router.push('/admin/trails')}
          sx={{ textTransform: 'none', color: tokens.text[2], fontSize: '0.8125rem', mb: 2, pl: 0 }}
        >
          Console de Trilhas
        </Button>
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
          Editar Trilha
        </Typography>
        <Typography sx={{ color: tokens.text[2], fontSize: '0.875rem' }}>
          Atualize os dados e gerencie os desafios desta trilha.
        </Typography>
      </Box>

      {/* Trail details */}
      <Box
        component="form"
        onSubmit={handleSaveTrail}
        sx={{
          p: 3,
          bgcolor: tokens.bg[3],
          border: `1px solid ${tokens.line.default}`,
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>Dados da trilha</Typography>
        {trailError && (
          <Alert severity="error" sx={{ borderRadius: '10px' }}>
            {trailError}
          </Alert>
        )}
        <TextField
          label="Nome da trilha"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          fullWidth
          multiline
          rows={3}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={savingTrail || !name.trim() || !description.trim()}
            startIcon={trailSaved ? <CheckIcon sx={{ fontSize: '16px !important' }} /> : undefined}
            sx={{ textTransform: 'none', borderRadius: '10px', px: 3, minWidth: 120 }}
          >
            {savingTrail ? 'Salvando…' : trailSaved ? 'Salvo!' : 'Salvar'}
          </Button>
        </Box>
      </Box>

      {/* Challenges */}
      <Box
        sx={{
          p: 3,
          bgcolor: tokens.bg[3],
          border: `1px solid ${tokens.line.default}`,
          borderRadius: '16px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>Desafios</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: tokens.text[2] }}>
              {challenges.length} desafio{challenges.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setShowAddForm((v) => !v)}
            sx={{ textTransform: 'none', borderRadius: '8px' }}
          >
            Adicionar
          </Button>
        </Box>

        {/* Add form */}
        {showAddForm && (
          <Box
            component="form"
            onSubmit={handleAddChallenge}
            sx={{
              mb: 2,
              p: 2,
              bgcolor: tokens.bg[0],
              border: `1px solid ${tokens.line.strong}`,
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>Novo desafio</Typography>
            {addError && (
              <Alert severity="error" sx={{ borderRadius: '8px', py: 0 }}>
                {addError}
              </Alert>
            )}
            <TextField
              size="small"
              label="Título"
              value={addTitle}
              onChange={(e) => setAddTitle(e.target.value)}
              required
              fullWidth
            />
            <TextField
              size="small"
              label="Descrição"
              value={addDesc}
              onChange={(e) => setAddDesc(e.target.value)}
              required
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              size="small"
              label="Ordem"
              type="number"
              value={addOrder}
              onChange={(e) => setAddOrder(Number(e.target.value))}
              required
              sx={{ width: 100 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                onClick={() => {
                  setShowAddForm(false);
                  setAddError('');
                }}
                sx={{ textTransform: 'none', color: tokens.text[2] }}
              >
                Cancelar
              </Button>
              <Button
                size="small"
                type="submit"
                variant="contained"
                disabled={addingChallenge || !addTitle.trim() || !addDesc.trim()}
                sx={{ textTransform: 'none', borderRadius: '8px' }}
              >
                {addingChallenge ? 'Adicionando…' : 'Adicionar'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Challenge list */}
        {loadingChallenges ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : challenges.length === 0 ? (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography sx={{ color: tokens.text[2], fontSize: '0.875rem' }}>
              Nenhum desafio adicionado ainda.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {challenges.map((c, i) => (
              <Box key={c.id}>
                {i > 0 && <Divider sx={{ borderColor: tokens.line.default }} />}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.5 }}>
                  <DragIndicatorIcon
                    sx={{ fontSize: 16, color: tokens.text[3], mt: '3px', flexShrink: 0 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                      <Chip
                        label={`#${c.order}`}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.6875rem',
                          fontFamily: 'var(--f-mono)',
                          bgcolor: tokens.bg[0],
                        }}
                      />
                      <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {c.title}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '0.8125rem',
                        color: tokens.text[2],
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {c.description}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.25, flexShrink: 0 }}>
                    <IconButton
                      size="small"
                      onClick={() => openEdit(c)}
                      sx={{
                        color: tokens.text[2],
                        borderRadius: '6px',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      <EditOutlinedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setDeleteChallId(c.id);
                        setDeleteChallError('');
                      }}
                      sx={{
                        color: tokens.text[2],
                        borderRadius: '6px',
                        '&:hover': { color: 'error.main' },
                      }}
                    >
                      <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Edit challenge dialog */}
      <Dialog
        open={!!editChallenge}
        onClose={() => !savingEdit && setEditChallenge(null)}
        fullWidth
        maxWidth="sm"
        slotProps={paperSlot(tokens.bg[3], paperStyle)}
      >
        <DialogTitle sx={{ fontFamily: 'var(--f-serif)', fontWeight: 400, fontSize: '1.375rem' }}>
          Editar desafio
        </DialogTitle>
        <Box component="form" onSubmit={handleEditChallenge}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 0 }}>
            {editError && (
              <Alert severity="error" sx={{ borderRadius: '10px' }}>
                {editError}
              </Alert>
            )}
            <TextField
              label="Título"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Descrição"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              required
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Ordem"
              type="number"
              value={editOrder}
              onChange={(e) => setEditOrder(Number(e.target.value))}
              required
              sx={{ width: 120 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button
              onClick={() => setEditChallenge(null)}
              disabled={savingEdit}
              sx={{ textTransform: 'none', color: tokens.text[2] }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={savingEdit || !editTitle.trim() || !editDesc.trim()}
              sx={{ textTransform: 'none', borderRadius: '8px' }}
            >
              {savingEdit ? 'Salvando…' : 'Salvar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete challenge dialog */}
      <Dialog
        open={!!deleteChallId}
        onClose={() => !deletingChall && setDeleteChallId(null)}
        slotProps={paperSlot(tokens.bg[3], paperStyle)}
      >
        <DialogTitle sx={{ fontFamily: 'var(--f-serif)', fontWeight: 400, fontSize: '1.375rem' }}>
          Excluir desafio?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.9rem', color: tokens.text[2] }}>
            O desafio <strong style={{ color: 'inherit' }}>{challToDelete?.title}</strong> será
            removido permanentemente.
          </Typography>
          {deleteChallError && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: '10px' }}>
              {deleteChallError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setDeleteChallId(null)}
            disabled={deletingChall}
            sx={{ textTransform: 'none', color: tokens.text[2] }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteChallenge}
            disabled={deletingChall}
            sx={{ textTransform: 'none', borderRadius: '8px' }}
          >
            {deletingChall ? 'Excluindo…' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
