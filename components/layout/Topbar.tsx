'use client';

import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { tokens } from '../../lib/tokens';

// ─── Breadcrumb helpers ──────────────────────────────────────────────────────

const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Home',
  trilha: 'Minhas Trilhas',
  aula: 'Aula',
  progresso: 'Progresso',
  perfil: 'Perfil',
  mentor: 'Mentor',
  configuracoes: 'Configurações',
  signin: 'Login',
  signup: 'Cadastro',
  onboarding: 'Início',
};

interface Crumb {
  label: string;
  isCurrent: boolean;
}

function buildCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: Crumb[] = [{ label: 'Trail', isCurrent: segments.length === 0 }];
  segments.forEach((seg, i) => {
    crumbs.push({
      label: ROUTE_LABELS[seg] ?? seg,
      isCurrent: i === segments.length - 1,
    });
  });
  return crumbs;
}

// ─── Topbar ──────────────────────────────────────────────────────────────────

export default function Topbar() {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);

  return (
    <Box
      component="header"
      sx={{
        height: 60,
        flexShrink: 0,
        borderBottom: `1px solid ${tokens.line.default}`,
        display: 'flex',
        alignItems: 'center',
        px: 4,
        gap: 2.5,
        bgcolor: 'background.default',
      }}
    >
      {/* Breadcrumbs */}
      <Box
        component="nav"
        aria-label="Breadcrumb"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: 13,
          color: 'text.secondary',
        }}
      >
        {crumbs.map((crumb, i) => (
          <Box key={crumb.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {i > 0 && (
              <Box component="span" aria-hidden="true" sx={{ color: tokens.text[3] }}>
                /
              </Box>
            )}
            <Typography
              component="span"
              sx={{
                fontSize: 13,
                color: crumb.isCurrent ? 'text.primary' : 'text.secondary',
                fontWeight: crumb.isCurrent ? 500 : 400,
              }}
            >
              {crumb.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Search — decorative, no logic yet */}
      <Box
        role="search"
        aria-label="Buscar (em breve)"
        sx={{
          ml: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'background.paper',
          border: `1px solid ${tokens.line.default}`,
          borderRadius: 1,
          px: 1.5,
          py: '7px',
          width: 280,
          color: 'text.disabled',
          fontSize: 13,
          cursor: 'default',
        }}
      >
        <SearchOutlinedIcon sx={{ fontSize: 14, flexShrink: 0 }} />
        <Box component="span" sx={{ flex: 1, userSelect: 'none' }}>
          Buscar...
        </Box>
        <Box
          component="kbd"
          sx={{
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            px: '5px',
            py: '2px',
            bgcolor: tokens.bg[3],
            border: `1px solid ${tokens.line.default}`,
            borderRadius: '4px',
            color: 'text.disabled',
          }}
        >
          ⌘K
        </Box>
      </Box>

      {/* Notifications — decorative */}
      {/* TODO: implement notifications panel */}
      <IconButton
        aria-label="Notificações"
        size="small"
        sx={{
          width: 34,
          height: 34,
          color: 'text.secondary',
          borderRadius: 1,
          '&:hover': { bgcolor: 'background.paper' },
        }}
      >
        <NotificationsNoneOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
}
