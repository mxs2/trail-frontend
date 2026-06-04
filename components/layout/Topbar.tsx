'use client';

import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tokens } from '../../lib/tokens';
import { useStore } from '../../store/useStore';

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
  admin: 'Admin',
  trails: 'Trilhas',
  new: 'Nova Trilha',
  edit: 'Editar',
  queue: 'Fila de Revisão',
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Crumb {
  label: string;
  isCurrent: boolean;
}

function buildCrumbs(pathname: string, resolveId: (id: string) => string | undefined): Crumb[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: Crumb[] = [{ label: 'Trail', isCurrent: segments.length === 0 }];
  segments.forEach((seg, i) => {
    const label = UUID_RE.test(seg)
      ? (resolveId(seg) ?? seg.slice(0, 8) + '…')
      : (ROUTE_LABELS[seg] ?? seg);
    crumbs.push({ label, isCurrent: i === segments.length - 1 });
  });
  return crumbs;
}

export default function Topbar() {
  const pathname = usePathname();
  const trails = useStore((s) => s.trails);
  const crumbs = buildCrumbs(pathname, (id) => trails.find((t) => t.id === id)?.title);

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
        bgcolor: 'background.default',
      }}
    >
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
    </Box>
  );
}
