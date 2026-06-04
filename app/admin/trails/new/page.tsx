'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../store/useStore';
import { api } from '../../../../services/api';
import { tokens } from '../../../../lib/tokens';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function NewTrailPage() {
  const router = useRouter();
  const setTrails = useStore((s) => s.setTrails);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const created = await api.createTrail({ name: name.trim(), description: description.trim() });
      const freshTrails = await api.getTrails();
      setTrails(freshTrails);
      router.push(`/admin/trails/${created.id}/edit`);
    } catch {
      setError('Não foi possível criar a trilha. Tente novamente.');
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 680 }}>
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
          Nova Trilha
        </Typography>
        <Typography sx={{ color: tokens.text[2], fontSize: '0.875rem' }}>
          Após criar, você poderá adicionar desafios à trilha.
        </Typography>
      </Box>

      {/* Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
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
        {error && (
          <Alert severity="error" sx={{ borderRadius: '10px' }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Nome da trilha"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          placeholder="Ex: Fundamentos de React"
        />

        <TextField
          label="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          fullWidth
          multiline
          rows={4}
          placeholder="Descreva o conteúdo e objetivos desta trilha…"
        />

        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            onClick={() => router.push('/admin/trails')}
            disabled={submitting}
            sx={{ textTransform: 'none', color: tokens.text[2] }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || !name.trim() || !description.trim()}
            endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
            sx={{ textTransform: 'none', borderRadius: '10px', px: 3 }}
          >
            {submitting ? 'Criando…' : 'Criar e adicionar desafios'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
