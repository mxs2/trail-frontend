import React from 'react';
import { Box, Card, CardContent, Skeleton, Stack, Container, Grid, Paper } from '@mui/material';

export function FeatureCardSkeleton() {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 0,
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'grey.200',
      }}
    >
      <CardContent sx={{ p: 5, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Skeleton variant="rectangular" width={68} height={68} sx={{ mb: 3 }} />
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="90%" height={20} />
        <Skeleton variant="text" width="80%" height={20} />
      </CardContent>
    </Card>
  );
}

export function TrailCardSkeleton() {
  return (
    <Card
      sx={{
        height: '100%',
        p: 1,
        borderRadius: 3,
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'grey.200',
      }}
    >
      <CardContent>
        <Skeleton variant="text" width="70%" height={40} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 4 }} />
          <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 4 }} />
        </Box>
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="80%" height={20} />
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Skeleton variant="text" width={120} height={36} />
      </Box>
    </Card>
  );
}

export function TrailsSkeleton() {
  return (
    <Box sx={{ py: 6, bgcolor: '#FAFAFA', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Skeleton variant="text" width="40%" height={60} sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 6, borderRadius: 1 }} />
        <Grid container spacing={4}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <TrailCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export function DashboardSkeleton() {
  return (
    <Box sx={{ py: 6, bgcolor: '#F4F6F8', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Skeleton variant="text" width="40%" height={60} sx={{ mb: 6 }} />

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {[1, 2, 3].map((i) => (
            <Grid size={{ xs: 12, md: 4 }} key={i}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                    <Skeleton variant="text" width="60%" height={24} />
                  </Box>
                  <Skeleton variant="text" width="30%" height={60} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Paper
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Box
            sx={{
              p: 3,
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: 1,
              borderColor: 'grey.200',
            }}
          >
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 6 }} />
          </Box>
          <Box sx={{ p: 3 }}>
            <Skeleton variant="rectangular" width="100%" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="100%" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={40} sx={{ mb: 1 }} />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export function TrailDetailsSkeleton() {
  return (
    <Box sx={{ mx: 'auto', p: 8, maxWidth: '48rem' }}>
      <Skeleton variant="text" width={150} height={24} sx={{ mb: 6 }} />
      <Paper
        sx={{
          p: 8,
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Skeleton variant="text" width="70%" height={60} sx={{ mb: 4 }} />
        <Box sx={{ display: 'flex', gap: 2, mb: 6 }}>
          <Skeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: 4 }} />
          <Skeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: 4 }} />
          <Skeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: 4 }} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" width={200} height={36} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="100%" height={24} />
          <Skeleton variant="text" width="100%" height={24} />
          <Skeleton variant="text" width="95%" height={24} />
          <Skeleton variant="text" width="98%" height={24} />
        </Box>
        <Box sx={{ mt: 10, pt: 6, borderTop: '1px solid', borderColor: 'grey.100' }}>
          <Skeleton variant="rectangular" width={160} height={48} sx={{ borderRadius: 1 }} />
        </Box>
      </Paper>
    </Box>
  );
}

export function PageSkeleton() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
      <Skeleton variant="rectangular" width="50%" height={64} sx={{ mb: 2, borderRadius: 1 }} />
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 8 }} />

      <Stack spacing={4} direction={{ xs: 'column', md: 'row' }} sx={{ mb: 6 }}>
        <Box sx={{ flex: 1 }}>
          <FeatureCardSkeleton />
        </Box>
        <Box sx={{ flex: 1 }}>
          <FeatureCardSkeleton />
        </Box>
        <Box sx={{ flex: 1 }}>
          <FeatureCardSkeleton />
        </Box>
      </Stack>
    </Container>
  );
}
