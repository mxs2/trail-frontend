'use client';

// Icons: @mui/icons-material — already installed, avoids adding lucide-react dependency.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '../ui/Logo';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { useStore } from '../../store/useStore';
import { tokens } from '../../lib/tokens';

export const SIDEBAR_WIDTH = 248;

// ─── Nav definitions ────────────────────────────────────────────────────────

interface NavDef {
  id: string;
  label: string;
  href: string;
  Icon: React.ElementType;
  isActive: (pathname: string) => boolean;
}

const MAIN_NAV: NavDef[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    Icon: HomeOutlinedIcon,
    // Active only on exact /dashboard; Minhas Trilhas handles /trilha/*
    isActive: (p) => p === '/dashboard',
  },
  {
    id: 'trilhas',
    label: 'Minhas Trilhas',
    href: '/trilha/react-fundamentals',
    Icon: LayersOutlinedIcon,
    isActive: (p) => p.startsWith('/trilha'),
  },
  {
    id: 'progresso',
    label: 'Progresso',
    href: '/progresso',
    Icon: BarChartOutlinedIcon,
    isActive: (p) => p.startsWith('/progresso'),
  },
];

const GENERAL_NAV: NavDef[] = [
  {
    id: 'perfil',
    label: 'Perfil',
    href: '/perfil',
    Icon: PersonOutlinedIcon,
    isActive: (p) => p.startsWith('/perfil'),
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    href: '/configuracoes',
    Icon: SettingsOutlinedIcon,
    isActive: (p) => p.startsWith('/configuracoes'),
  },
];

const MENTOR_NAV: NavDef[] = [
  {
    id: 'mentor',
    label: 'Mentor',
    href: '/mentor',
    Icon: GroupOutlinedIcon,
    isActive: (p) => p.startsWith('/mentor'),
  },
];

// ─── NavItem ────────────────────────────────────────────────────────────────

interface NavItemProps {
  def: NavDef;
  active: boolean;
  count?: number;
}

function NavItem({ def, active, count }: NavItemProps) {
  const { Icon, label, href } = def;
  return (
    <Box
      component={Link}
      href={href}
      aria-current={active ? 'page' : undefined}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 1.5,
        py: '9px',
        borderRadius: 1,
        fontSize: 14,
        fontWeight: 500,
        color: active ? 'text.primary' : 'text.secondary',
        bgcolor: active ? tokens.bg[3] : 'transparent',
        position: 'relative',
        textDecoration: 'none',
        transition: 'background 120ms, color 120ms',
        '&:hover': { bgcolor: tokens.bg[3], color: 'text.primary' },
      }}
    >
      {/* Active left-edge indicator */}
      {active && (
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            left: 0,
            top: 10,
            bottom: 10,
            width: 2,
            bgcolor: 'primary.main',
            borderRadius: '2px',
          }}
        />
      )}
      <Icon sx={{ fontSize: 16, opacity: active ? 1 : 0.75, flexShrink: 0 }} />
      <Box component="span" sx={{ flex: 1 }}>
        {label}
      </Box>
      {count != null && count > 0 && (
        <Box
          component="span"
          sx={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'text.disabled' }}
        >
          {count}
        </Box>
      )}
    </Box>
  );
}

// ─── Section label ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography
      variant="caption"
      component="div"
      sx={{
        px: 1.5,
        pt: '14px',
        pb: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: tokens.text[3],
        userSelect: 'none',
      }}
    >
      {children}
    </Typography>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();
  const user = useStore((s) => s.user);
  const trails = useStore((s) => s.trails);
  const isMentor = user?.role === 'mentor';

  return (
    <Box
      component="aside"
      aria-label="Navegação principal"
      sx={{
        width: SIDEBAR_WIDTH,
        bgcolor: tokens.bg[0],
        borderRight: `1px solid ${tokens.line.default}`,
        px: '14px',
        py: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        height: '100%',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: '10px',
          pb: '16px',
          pt: '8px',
          gap: 1,
          flexShrink: 0,
        }}
      >
        <Logo />
        <Box
          component="span"
          sx={{
            ml: 'auto',
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            color: tokens.text[2],
            px: '6px',
            py: '2px',
            border: `1px solid ${tokens.line.strong}`,
            borderRadius: '4px',
          }}
        >
          v0.9
        </Box>
      </Box>

      {/* Scrollable nav area — grows to fill, scrolls when items overflow */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {/* Main navigation */}
        <nav>
          <SectionLabel>Navegação</SectionLabel>
          {MAIN_NAV.map((def) => (
            <NavItem
              key={def.id}
              def={def}
              active={def.isActive(pathname)}
              count={def.id === 'trilhas' && trails.length > 0 ? trails.length : undefined}
            />
          ))}
        </nav>

        {/* General navigation */}
        <nav aria-label="Geral">
          <SectionLabel>Geral</SectionLabel>
          {GENERAL_NAV.map((def) => (
            <NavItem key={def.id} def={def} active={def.isActive(pathname)} />
          ))}
          {isMentor &&
            MENTOR_NAV.map((def) => (
              <NavItem key={def.id} def={def} active={def.isActive(pathname)} />
            ))}
        </nav>
      </Box>

      {/* Profile footer — always visible, never compressed */}
      <Box sx={{ flexShrink: 0 }}>
        {user ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              p: 1.25,
              borderRadius: '12px',
              border: `1px solid ${tokens.line.default}`,
              bgcolor: 'background.paper',
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF6200 0%, #E55A00 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 600,
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              {user.avatarInitials}
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.name}
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
                {user.role === 'aluno' ? `Aluno · Nível ${user.level}` : user.role}
              </Typography>
            </Box>
            {/* TODO: logout button */}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1.25 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="70%" height={14} />
              <Skeleton width="50%" height={12} sx={{ mt: 0.5 }} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
