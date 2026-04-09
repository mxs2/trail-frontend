import { Box, Container, Typography } from '@mui/material';

const stats = [
  { value: '10k+', label: 'Desenvolvedores Capacitados' },
  { value: '50+', label: 'Empresas Parceiras' },
  { value: '99%', label: 'Taxa de Satisfação' },
  { value: '24/7', label: 'Suporte Global' },
];

export function LandingStats() {
  return (
    <Box sx={{ py: 10, bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 4,
            textAlign: 'center',
          }}
        >
          {stats.map((stat) => (
            <Box key={stat.label} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  color: 'primary.main',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: 'secondary.contrastText', opacity: 0.8, fontWeight: 600 }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
