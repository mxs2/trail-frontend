'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { tokens } from '../../../lib/tokens';

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
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              bgcolor: 'primary.main',
            },
          }}
        />
      </Box>
      {!last && <Divider sx={{ borderColor: tokens.line.default }} />}
    </>
  );
}

function SelectRow({
  label,
  description,
  value,
  options,
  onChange,
  last,
}: {
  label: string;
  description?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
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
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          sx={{
            flexShrink: 0,
            minWidth: 130,
            fontSize: '0.8125rem',
            bgcolor: tokens.bg[0],
            color: 'text.primary',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: tokens.line.strong },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: tokens.line.strong },
            '& .MuiSvgIcon-root': { color: tokens.text[2] },
          }}
        >
          {options.map((o) => (
            <MenuItem key={o.value} value={o.value} sx={{ fontSize: '0.8125rem' }}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      {!last && <Divider sx={{ borderColor: tokens.line.default }} />}
    </>
  );
}

export default function ConfiguracoesPage() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);

  const [emailNotif, setEmailNotif] = useState(true);
  const [progressReminder, setProgressReminder] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  const [language, setLanguage] = useState('pt-BR');
  const [studyGoal, setStudyGoal] = useState('1h');
  const [autoplay, setAutoplay] = useState(true);
  const [subtitles, setSubtitles] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 680 }}>
      {/* Header */}
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
          Personalize sua experiência na plataforma
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
          checked={twoFactor}
          onChange={setTwoFactor}
        />
        <ToggleRow
          label="Perfil público"
          description="Outros alunos podem ver seu progresso"
          checked={publicProfile}
          onChange={setPublicProfile}
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
          subtitle="Escolha o que você quer receber"
        />
        <ToggleRow
          label="E-mails de novidades"
          description="Novas aulas e atualizações de trilha"
          checked={emailNotif}
          onChange={setEmailNotif}
        />
        <ToggleRow
          label="Lembrete de estudo"
          description="Aviso diário para manter a sequência"
          checked={progressReminder}
          onChange={setProgressReminder}
        />
        <ToggleRow
          label="Sugestões da IA"
          description="Recomendações personalizadas do Tutor IA"
          checked={aiSuggestions}
          onChange={setAiSuggestions}
        />
        <ToggleRow
          label="Relatório semanal"
          description="Resumo do seu progresso por e-mail toda semana"
          checked={weeklyReport}
          onChange={setWeeklyReport}
          last
        />
      </Box>

      {/* Preferências */}
      <Box
        sx={{
          p: 3,
          bgcolor: tokens.bg[3],
          border: `1px solid ${tokens.line.default}`,
          borderRadius: '16px',
        }}
      >
        <SectionHeader
          icon={<TuneOutlinedIcon sx={{ fontSize: 18 }} />}
          title="Preferências"
          subtitle="Ajuste o comportamento da plataforma"
        />
        <SelectRow
          label="Idioma"
          value={language}
          options={[
            { value: 'pt-BR', label: 'Português (BR)' },
            { value: 'en-US', label: 'English (US)' },
            { value: 'es', label: 'Español' },
          ]}
          onChange={setLanguage}
        />
        <SelectRow
          label="Meta diária de estudo"
          description="Duração que você quer estudar por dia"
          value={studyGoal}
          options={[
            { value: '30m', label: '30 minutos' },
            { value: '1h', label: '1 hora' },
            { value: '2h', label: '2 horas' },
            { value: '3h', label: '3 horas ou mais' },
          ]}
          onChange={setStudyGoal}
        />
        <ToggleRow
          label="Reprodução automática"
          description="Próxima aula inicia automaticamente"
          checked={autoplay}
          onChange={setAutoplay}
        />
        <ToggleRow
          label="Legendas por padrão"
          description="Exibir legendas em todos os vídeos"
          checked={subtitles}
          onChange={setSubtitles}
          last
        />
      </Box>
    </Box>
  );
}
