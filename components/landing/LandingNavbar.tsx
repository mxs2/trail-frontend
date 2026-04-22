import Image from 'next/image';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { tokens } from '../../lib/tokens';

const NAV_LINKS = [
  { label: 'Plataforma', href: '#plataforma' },
  { label: 'Para mentores', href: '#mentores' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Depoimentos', href: '#depoimentos' },
];

export default function LandingNavbar() {
  return (
    <Box
      component="nav"
      aria-label="Navegação da landing page"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        px: { xs: 3, md: 6 },
        py: 3,
        borderBottom: `1px solid ${tokens.line.default}`,
        bgcolor: 'background.default',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <Image
        src="/trail-logo.png"
        alt="Trail"
        width={92}
        height={22}
        style={{ filter: 'brightness(0) invert(1)', opacity: 0.95 }}
        priority
      />

      {/* Nav links — hidden on mobile */}
      <Box
        component="ul"
        sx={{
          display: { xs: 'none', md: 'flex' },
          gap: 3.5,
          ml: 5,
          p: 0,
          m: 0,
          listStyle: 'none',
        }}
      >
        {NAV_LINKS.map(({ label, href }) => (
          <Box component="li" key={label}>
            <Typography
              component="a"
              href={href}
              sx={{
                fontSize: 14,
                color: 'text.secondary',
                textDecoration: 'none',
                transition: 'color 120ms',
                '&:hover': { color: 'text.primary' },
              }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ ml: 'auto', display: 'flex', gap: 1.25, alignItems: 'center' }}>
        <Button href="/signin" variant="text" size="small">
          Entrar
        </Button>
        <Button href="/signup" variant="contained" size="small">
          Criar conta
        </Button>
      </Box>
    </Box>
  );
}
