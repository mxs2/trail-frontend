import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { SvgIconComponent } from '@mui/icons-material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { tokens } from '../../lib/tokens';

interface Pillar {
  Icon: SvgIconComponent;
  title: string;
  description: string;
}

const PILLARS: Pillar[] = [
  {
    Icon: AutoAwesomeIcon,
    title: 'Onboarding inteligente',
    description:
      'Responda 5 perguntas. A IA monta uma trilha única com módulos, aulas e exercícios sob medida para seu objetivo e ritmo.',
  },
  {
    Icon: GpsFixedIcon,
    title: 'Execução guiada',
    description:
      'Conteúdo em etapas com desbloqueio progressivo. Feedback a cada aula. Notas associadas ao minuto exato do vídeo.',
  },
  {
    Icon: TrendingUpIcon,
    title: 'Adaptação contínua',
    description:
      'A IA observa onde você trava, o quanto acertou nos exercícios, e reorganiza a trilha — sem você pedir.',
  },
  {
    Icon: GroupOutlinedIcon,
    title: 'Mentoria orientada a dados',
    description:
      'Mentores enxergam progresso individual e coletivo em tempo real. Alunos em risco são sinalizados automaticamente.',
  },
];

// ─── Eyebrow helper ──────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: string }) {
  return (
    <Box
      sx={{
        fontFamily: 'var(--f-mono)',
        fontSize: 12,
        color: 'primary.main',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        mb: 1.5,
      }}
    >
      {children}
    </Box>
  );
}

// ─── LandingFeatures ─────────────────────────────────────────────────────────

export default function LandingFeatures() {
  return (
    <Box
      component="section"
      id="plataforma"
      sx={{
        px: { xs: 3, md: 6 },
        py: { xs: '60px', md: '80px' },
        borderTop: `1px solid ${tokens.line.default}`,
        maxWidth: 1200,
        mx: 'auto',
      }}
    >
      <Eyebrow>Pilares</Eyebrow>
      <Typography
        component="h2"
        sx={{
          fontFamily: 'var(--f-serif)',
          fontWeight: 400,
          fontSize: { xs: '2rem', md: '2.75rem' },
          lineHeight: 1.1,
          mb: { xs: '40px', md: '60px' },
          maxWidth: 720,
          color: 'text.primary',
        }}
      >
        Uma plataforma desenhada em torno de como devs realmente aprendem.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 2.5,
        }}
      >
        {PILLARS.map(({ Icon, title, description }) => (
          <Card key={title}>
            <CardContent>
              <Box
                aria-hidden="true"
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  bgcolor: tokens.orange.soft,
                  border: `1px solid ${tokens.orange.ring}`,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2.5,
                  flexShrink: 0,
                }}
              >
                <Icon sx={{ fontSize: 18 }} />
              </Box>
              <Typography
                component="h3"
                sx={{
                  fontFamily: 'var(--f-serif)',
                  fontWeight: 400,
                  fontSize: 24,
                  lineHeight: 1.2,
                  mb: 1.25,
                  color: 'text.primary',
                }}
              >
                {title}
              </Typography>
              <Typography sx={{ fontSize: 14.5, color: tokens.text[2], lineHeight: 1.6 }}>
                {description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
