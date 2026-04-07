import { Box, Container, Typography, Grid } from '@mui/material';

const stats = [
  { value: '10k+', label: 'Desenvolvedores Capacitados' },
  { value: '50+', label: 'Empresas Parceiras' },
  { value: '99%', label: 'Taxa de Satisfação' },
  { value: '24/7', label: 'Suporte Global' },
];

export function LandingStats() {
  return (
    <Box sx={{ py: 10, bgcolor: '#FAFAFA', borderTop: '1px solid', borderColor: 'grey.200' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 4,
            textAlign: 'center',
          }}
        >
          {stats.map((stat, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: 'primary.main',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                {stat.value}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
