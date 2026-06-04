'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Logo from '../ui/Logo';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import Badge from '@mui/material/Badge';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useStore } from '../../store/useStore';
import { api } from '../../services/api';
import { tokens } from '../../lib/tokens';

export const SIDEBAR_WIDTH = 248;

// ─── Role display helpers ────────────────────────────────────────────────────

const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrador',
  mentor: 'Mentor',
  aluno: 'Aluno',
};

const ROLE_COLOR: Record<string, string> = {
  admin: '#FF6200',
  mentor: '#A78BFA',
  aluno: '#5EEAD4',
};

// ─── Nav definitions ─────────────────────────────────────────────────────────

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
    isActive: (p) => p === '/dashboard',
  },
  {
    id: 'trilhas',
    label: 'Minhas Trilhas',
    href: '/trilha',
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
    id: 'mentor-queue',
    label: 'Fila de Revisão',
    href: '/mentor/queue',
    Icon: GroupOutlinedIcon,
    isActive: (p) => p.startsWith('/mentor'),
  },
];

const ADMIN_NAV: NavDef[] = [
  {
    id: 'admin-trails',
    label: 'Gerenciar Trilhas',
    href: '/admin/trails',
    Icon: AdminPanelSettingsOutlinedIcon,
    isActive: (p) => p.startsWith('/admin'),
  },
];

// ─── NavItem ─────────────────────────────────────────────────────────────────

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
        py: '14px',
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

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography
      variant="caption"
      component="div"
      sx={{
        px: 1.5,
        pt: '6px',
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
  const router = useRouter();
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const setTrails = useStore((s) => s.setTrails);
  const trails = useStore((s) => s.trails);
  const isMentor = user?.role === 'mentor';
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'aluno';
  const roleColor = user ? (ROLE_COLOR[user.role] ?? tokens.text[2]) : tokens.text[2];

  // Pending submissions badge — polled every 60s for mentor/admin
  const [pendingCount, setPendingCount] = useState(0);
  useEffect(() => {
    if (!isMentor && !isAdmin) return;
    const load = () =>
      api
        .getPendingCount()
        .then(setPendingCount)
        .catch(() => {});
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [isMentor, isAdmin]);

  async function handleLogout() {
    await api.logout();
    setUser(null);
    setTrails([]);
    router.push('/signin');
  }

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
      </Box>

      {/* Scrollable nav */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {isStudent ? (
          // ── Student layout: two labelled sections ─────────────────────────
          <>
            <nav>
              <SectionLabel>Navegação</SectionLabel>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {MAIN_NAV.map((def) => (
                  <NavItem
                    key={def.id}
                    def={def}
                    active={def.isActive(pathname)}
                    count={def.id === 'trilhas' && trails.length > 0 ? trails.length : undefined}
                  />
                ))}
              </Box>
            </nav>

            <nav aria-label="Geral">
              <SectionLabel>Geral</SectionLabel>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {GENERAL_NAV.map((def) => (
                  <NavItem key={def.id} def={def} active={def.isActive(pathname)} />
                ))}
              </Box>
            </nav>
          </>
        ) : (
          // ── Admin / Mentor layout: Dashboard at top, then one flat section ─
          <>
            <nav>
              {/* Dashboard sits alone at the top — no section label needed */}
              <NavItem def={MAIN_NAV[0]} active={MAIN_NAV[0].isActive(pathname)} />
            </nav>

            <nav aria-label="Geral">
              <SectionLabel>Geral</SectionLabel>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {GENERAL_NAV.map((def) => (
                  <NavItem key={def.id} def={def} active={def.isActive(pathname)} />
                ))}
                {isMentor &&
                  MENTOR_NAV.map((def) => (
                    <NavItem
                      key={def.id}
                      def={def}
                      active={def.isActive(pathname)}
                      count={
                        def.id === 'mentor-queue' && pendingCount > 0 ? pendingCount : undefined
                      }
                    />
                  ))}
              </Box>
            </nav>

            {isAdmin && (
              <nav aria-label="Admin">
                <SectionLabel>Admin</SectionLabel>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {ADMIN_NAV.map((def) => (
                    <NavItem key={def.id} def={def} active={def.isActive(pathname)} />
                  ))}
                </Box>
              </nav>
            )}
          </>
        )}
      </Box>

      {/* Profile footer */}
      <Box sx={{ flexShrink: 0 }}>
        {user ? (
          <Box
            sx={{
              p: 1.25,
              borderRadius: '12px',
              border: `1px solid ${tokens.line.default}`,
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              {/* Avatar with role-colour ring */}
              <Box
                aria-hidden="true"
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${roleColor} 0%, ${roleColor}cc 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {/* Role pill */}
                  <Box
                    sx={{
                      px: '5px',
                      py: '1px',
                      borderRadius: '4px',
                      bgcolor: `${roleColor}22`,
                      border: `1px solid ${roleColor}55`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 10,
                        color: roleColor,
                        fontFamily: 'var(--f-mono)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {ROLE_LABEL[user.role] ?? user.role}
                    </Typography>
                  </Box>
                  {user.role === 'aluno' && (
                    <Typography sx={{ fontSize: 10, color: 'text.disabled' }}>
                      Nível {user.level}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Tooltip title="Sair" placement="top">
                <Box
                  component="button"
                  onClick={handleLogout}
                  aria-label="Sair da conta"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 28,
                    height: 28,
                    borderRadius: '6px',
                    border: 'none',
                    bgcolor: 'transparent',
                    color: tokens.text[3],
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'color 120ms, background 120ms',
                    '&:hover': { bgcolor: tokens.bg[4], color: 'text.primary' },
                  }}
                >
                  <LogoutOutlinedIcon sx={{ fontSize: 15 }} />
                </Box>
              </Tooltip>
            </Box>
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
