'use client';

import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { tokens } from '../../../lib/tokens';
import { api, UserSettings } from '../../../services/api';

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2.5 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          bgcolor: tokens.bg[0],
          border: `1px solid ${tokens.line.default}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: tokens.text[2],
          flexShrink: 0,
          mt: 0.25,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>{title}</Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: tokens.text[2] }}>{subtitle}</Typography>
      </Box>
    </Box>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  last,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          py: 1.75,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</Typography>
          {description && (
            <Typography sx={{ fontSize: '0.75rem', color: tokens.text[2], mt: 0.25 }}>
              {description}
            </Typography>
          )}
        </Box>
        <Switch
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          size="small"
          sx={{
            flexShrink: 0,
            '& .MuiSwitch-switchBase.Mui-checked': { color: 'primary.main' },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'primary.main' },
          }}
        />
      </Box>
      {!last && <Divider sx={{ borderColor: tokens.line.default }} />}
    </>
  );
}

const DEFAULT_SETTINGS: UserSettings = {
  twoFactorEnabled: false,
  publicProfile: true,
  emailNotifications: true,
  studyReminder: true,
  aiSuggestions: false,
  weeklyReport: false,
  language: 'pt-BR',
  dailyStudyGoal: '1h',
  autoplay: true,
  subtitles: false,
};

export default function ConfiguracoesPage() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const loaded = useRef(false);

  useEffect(() => {
    api
      .getSettings()
      .then((s) => {
        setSettings(s);
        loaded.current = true;
      })
      .catch(() => {
        loaded.current = true;
      });
  }, []);

  function update<K extends keyof UserSettings>(key: K, value: UserSettings[K]) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    if (loaded.current) api.updateSettings(next).catch(() => {});
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 620 }}>
      <Box>
        <Typography
          component="h1"
          sx={{
            fontFamily: 'var(--f-serif)',
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            fontWeight: 400,
            lineHeight: 1.15,
            mb: 0.5,
          }}
        >
          Configurações
        </Typography>
        <Typography sx={{ color: tokens.text[2], fontSize: '0.875rem' }}>
          Gerencie sua conta e notificações
        </Typography>
      </Box>

      {/* Conta */}
      <Box
        sx={{
          p: 3,
          bgcolor: tokens.bg[3],
          border: `1px solid ${tokens.line.default}`,
          borderRadius: '16px',
        }}
      >
        <SectionHeader
          icon={<PersonOutlinedIcon sx={{ fontSize: 18 }} />}
          title="Conta"
          subtitle="Segurança e visibilidade do seu perfil"
        />
        <ToggleRow
          label="Autenticação em dois fatores"
          description="Adiciona uma camada extra de segurança ao login"
          checked={settings.twoFactorEnabled}
          onChange={(v) => update('twoFactorEnabled', v)}
        />
        <ToggleRow
          label="Perfil público"
          description="Seu perfil pode ser visto por outros usuários da plataforma"
          checked={settings.publicProfile}
          onChange={(v) => update('publicProfile', v)}
          last
        />
      </Box>

      {/* Notificações */}
      <Box
        sx={{
          p: 3,
          bgcolor: tokens.bg[3],
          border: `1px solid ${tokens.line.default}`,
          borderRadius: '16px',
        }}
      >
        <SectionHeader
          icon={<NotificationsOutlinedIcon sx={{ fontSize: 18 }} />}
          title="Notificações"
          subtitle="E-mails enviados pela plataforma"
        />
        <ToggleRow
          label="E-mails da plataforma"
          description="Atualizações, novidades e comunicados do Trail"
          checked={settings.emailNotifications}
          onChange={(v) => update('emailNotifications', v)}
          last
        />
      </Box>
    </Box>
  );
}
