'use client';

import Link from 'next/link';
import { AppBar, Toolbar, Button, Box, Container, Typography } from '@mui/material';

export default function Navbar() {
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
          <Typography
            component={Link}
            href="/"
            variant="h5"
            sx={{
              fontWeight: 800,
              color: 'primary.main',
              textDecoration: 'none',
              letterSpacing: '-0.03em',
            }}
          >
            TRAIL
            <Box component="span" sx={{ color: 'primary.contrastText' }}>
              .
            </Box>
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              href="/trails"
              sx={{
                color: 'primary.contrastText',
                '&:hover': { color: 'primary.main', backgroundColor: 'transparent' },
              }}
            >
              Trilhas
            </Button>
            <Button component={Link} href="/dashboard" variant="contained" color="primary">
              Dashboard Admin
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
