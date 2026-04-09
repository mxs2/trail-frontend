'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Trail } from '@/types';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { TrailsSkeleton } from '@/components/LoadingSkeleton';

export default function TrailsPage() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTrails().then((data) => {
      setTrails(data);
      setLoading(false);
    });
  }, []);

  const filteredTrails = trails.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'success';
      case 'Intermediate':
        return 'warning';
      case 'Advanced':
        return 'error';
      default:
        return 'default';
    }
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

  if (loading) {
    return <TrailsSkeleton />;
  }

  return (
    <Box sx={{ py: 6, bgcolor: '#FAFAFA', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 4,
            color: 'text.primary',
            fontSize: { xs: '2rem', md: '2.5rem' },
          }}
        >
          Trilhas Disponíveis
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar trilha pelo nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 6, bgcolor: '#FFFFFF' }}
          slotProps={{
            input: {
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            },
          }}
        />

        <Grid container spacing={4}>
          {filteredTrails.map((trail) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={trail.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 1,
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                      {trail.title}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                    <Chip
                      label={getLevelLabel(trail.level)}
                      color={
                        getLevelColor(trail.level) as 'success' | 'warning' | 'error' | 'default'
                      }
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip label={`${trail.duration} min`} variant="outlined" size="small" />
                    {trail.status !== 'published' && (
                      <Chip
                        label={getStatusLabel(trail.status)}
                        variant="outlined"
                        color="default"
                        size="small"
                      />
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {trail.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    component={Link}
                    href={`/trails/${trail.id}`}
                    variant="text"
                    color="primary"
                    sx={{ fontWeight: 700, borderRadius: 2 }}
                  >
                    Ver Detalhes &rarr;
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredTrails.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h6" color="text.secondary">
              Nenhuma trilha encontrada.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
