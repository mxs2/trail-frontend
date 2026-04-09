'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Trail, DashboardMetrics } from '@/types';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PlayLessonIcon from '@mui/icons-material/PlayLesson';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { DashboardSkeleton } from '@/components/LoadingSkeleton';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      api.getDashboardMetrics().then(setMetrics),
      api.getTrails().then(setTrails),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'archived' : 'published';
    await api.updateTrailStatus(id, newStatus as Trail['status']);
    loadData(); // reload
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'Iniciante';
      case 'Intermediate':
        return 'Intermediário';
      case 'Advanced':
        return 'Avançado';
      default:
        return level;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado';
      case 'draft':
        return 'Rascunho';
      case 'archived':
        return 'Arquivado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ py: 6, bgcolor: '#F4F6F8', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 6,
            color: 'text.primary',
            fontSize: { xs: '2rem', md: '2.5rem' },
          }}
        >
          Dashboard Administrativo
        </Typography>

        {metrics && (
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 2, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PeopleAltIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}
                    >
                      Total de Usuários
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    {metrics.totalUsers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 2, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PlayLessonIcon sx={{ color: 'success.main', mr: 1 }} />
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}
                    >
                      Trilhas Ativas
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'success.main' }}>
                    {metrics.activeTrails}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 2, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUpIcon sx={{ color: 'secondary.main', mr: 1 }} />
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}
                    >
                      Conclusões (Semana)
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                    {metrics.completionsThisWeek}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        <Paper
          sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        >
          <Box
            sx={{
              p: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: 'grey.200',
              bgcolor: '#FFFFFF',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Gerenciar Trilhas
            </Typography>
            <Button
              component={Link}
              href="/dashboard/create"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ fontWeight: 600, px: 3 }}
            >
              Nova Trilha
            </Button>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Título</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Nível</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Duração</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'right' }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trails.map((trail) => (
                  <TableRow
                    key={trail.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                      {trail.title}
                    </TableCell>
                    <TableCell>{getLevelLabel(trail.level)}</TableCell>
                    <TableCell>{trail.duration} min</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(trail.status)}
                        color={getStatusColor(trail.status) as 'success' | 'warning' | 'default'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Button
                        component={Link}
                        href={`/trails/${trail.id}`}
                        variant="text"
                        size="small"
                        sx={{ mr: 1, fontWeight: 600 }}
                      >
                        Ver
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus(trail.id, trail.status)}
                        variant="outlined"
                        color="secondary"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      >
                        Alternar Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {trails.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      Nenhuma trilha encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
}
