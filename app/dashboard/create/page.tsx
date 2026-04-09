'use client';
import { useState } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { Trail } from '@/types';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function CreateTrailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    level: 'Beginner' as Trail['level'],
    status: 'draft' as Trail['status'],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await api.createTrail(formData);
    router.push('/dashboard');
  };

  return (
    <Box sx={{ py: 6, bgcolor: '#FAFAFA', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Button
          component={Link}
          href="/dashboard"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 4, color: 'text.secondary', fontWeight: 600 }}
        >
          Voltar ao Dashboard
        </Button>

        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 800, mb: 4, color: 'text.primary' }}
            >
              Criar Nova Trilha
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
            >
              <TextField
                label="Título da Trilha"
                placeholder="Ex: Fundamentos de React"
                required
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <TextField
                label="Descrição Detalhada"
                placeholder="Descreva o que será ensinado nesta trilha..."
                required
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <Box
                sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}
              >
                <TextField
                  label="Duração (minutos)"
                  type="number"
                  required
                  fullWidth
                  slotProps={{ htmlInput: { min: 5 } }}
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                />

                <FormControl fullWidth required>
                  <InputLabel>Nível de Dificuldade</InputLabel>
                  <Select
                    value={formData.level}
                    label="Nível de Dificuldade"
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value as Trail['level'] })
                    }
                  >
                    <MenuItem value="Beginner">Iniciante</MenuItem>
                    <MenuItem value="Intermediate">Intermediário</MenuItem>
                    <MenuItem value="Advanced">Avançado</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <FormControl fullWidth required>
                <InputLabel>Status Inicial</InputLabel>
                <Select
                  value={formData.status}
                  label="Status Inicial"
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as Trail['status'] })
                  }
                >
                  <MenuItem value="draft">Rascunho</MenuItem>
                  <MenuItem value="published">Publicado</MenuItem>
                  <MenuItem value="archived">Arquivado</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  component={Link}
                  href="/dashboard"
                  variant="outlined"
                  color="inherit"
                  disabled={loading}
                  sx={{ borderColor: 'grey.300' }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  sx={{ px: 4 }}
                >
                  {loading ? 'Salvando...' : 'Salvar Trilha'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
