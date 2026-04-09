import { Box, Container, Typography, Link, Stack } from '@mui/material';

export function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#2b2b2b', color: 'rgba(255, 255, 255, 0.7)', py: 6 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
              gap: 2,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://ac-landing-pages-user-uploads-production.s3.amazonaws.com/0000118110/85054d7e-4730-47ad-8fc7-736e173fe481.png"
              alt="Avanade"
              style={{ height: '32px', filter: 'brightness(0) invert(1)' }}
            />
            <Typography variant="body2">
              © {new Date().getFullYear()} Squad 28. Todos os direitos reservados.
            </Typography>
          </Box>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={4}
            sx={{ textAlign: { xs: 'center', md: 'left' } }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ color: 'white', fontWeight: 'bold', mb: 2, fontSize: '1rem' }}
              >
                Plataforma
              </Typography>
              <Stack spacing={1}>
                <Link href="#" color="inherit" underline="hover">
                  Sobre Nós
                </Link>
                <Link href="#" color="inherit" underline="hover">
                  Recursos
                </Link>
                <Link href="#" color="inherit" underline="hover">
                  Preços
                </Link>
              </Stack>
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ color: 'white', fontWeight: 'bold', mb: 2, fontSize: '1rem' }}
              >
                Suporte
              </Typography>
              <Stack spacing={1}>
                <Link href="#" color="inherit" underline="hover">
                  FAQ
                </Link>
                <Link href="#" color="inherit" underline="hover">
                  Contato
                </Link>
                <Link href="#" color="inherit" underline="hover">
                  Termos de Serviço
                </Link>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
