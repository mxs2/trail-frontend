'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Trail } from '@/types';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TrailDetailsSkeleton } from '@/components/LoadingSkeleton';
import { Container, Box, Typography, Chip, Button, Paper, Stack, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function TrailDetailsPage() {
  const params = useParams();
  const [trail, setTrail] = useState<Trail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      api.getTrailById(params.id as string).then((data) => {
        if (data) setTrail(data);
        setLoading(false);
      });
    }
  }, [params.id]);

  if (loading) return <TrailDetailsSkeleton />;
  if (!trail)
    return (
      <Container maxWidth="sm">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography color="error">Trilha não encontrada.</Typography>
        </Box>
      </Container>
    );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'info';
      case 'Intermediate':
        return 'warning';
      default:
        return 'error';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'Iniciante';
      case 'Intermediate':
        return 'Intermediário';
      default:
        return 'Avançado';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Link href="/trails">
        <Button startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
          Voltar para Trilhas
        </Button>
      </Link>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>
          {trail.title}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 4, flexWrap: 'wrap' }}>
          <Chip
            label={getLevelLabel(trail.level)}
            color={getLevelColor(trail.level)}
            variant="outlined"
          />
          <Chip label={`${trail.duration} minutos`} variant="outlined" />
          <Chip
            label={trail.status === 'published' ? 'Publicado' : 'Rascunho'}
            color={trail.status === 'published' ? 'success' : 'warning'}
            variant="outlined"
          />
        </Stack>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            Sobre a Trilha
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {trail.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Button
          variant="contained"
          sx={{
            backgroundColor: '#D8005A',
            '&:hover': {
              backgroundColor: '#A80346',
            },
            py: 1.5,
            px: 3,
          }}
        >
          Iniciar Trilha
        </Button>
      </Paper>
    </Container>
  );
}
