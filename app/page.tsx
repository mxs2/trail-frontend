'use client';

import { Box } from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BarChartIcon from '@mui/icons-material/BarChart';

import { LandingHero } from '@/components/LandingHero';
import { LandingFeatures } from '@/components/LandingFeatures';
import { LandingStats } from '@/components/LandingStats';
import { FeatureType } from '@/components/FeatureCard';
import { Footer } from '@/components/Footer';

const features: FeatureType[] = [
  {
    title: 'Autenticação JWT Segura',
    description:
      'Gere e valide JSON Web Tokens para cada usuário com escopo seguro. O controle é granular, distribuído em escala e sem necessidade de estado na sessão.',
    icon: VpnKeyIcon,
  },
  {
    title: 'Submissões Práticas',
    description:
      'Submeta desafios de código no ambiente web com verificação inteligente em tempo real e acelere o onboarding do seu time técnico.',
    icon: AssignmentTurnedInIcon,
  },
  {
    title: 'Métricas e Insights',
    description:
      'Acompanhe resultados com dashboards dinâmicos atualizados continuamente. Saiba quem se destacou nas simulações e quem precisa de apoio.',
    icon: BarChartIcon,
  },
];

export default function LandingPage() {
  return (
    <Box component="main">
      <Box
        sx={{
          color: '#FFFFFF',
          background: 'linear-gradient(135deg, #FF2A00 0%, #D8005A 100%)',
          position: 'relative',
          pb: { xs: 8, md: 10 },
        }}
      >
        {/* Header */}
        <Box sx={{ py: 3, px: 4, display: 'flex' }}>
          <img 
            src="https://ac-landing-pages-user-uploads-production.s3.amazonaws.com/0000118110/85054d7e-4730-47ad-8fc7-736e173fe481.png"
            alt="Avanade"
            style={{ height: '72px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
          />
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <LandingHero
            badgeText="Capacitação Inteligente Avanade"
            titlePrimary={
              <>
                Treine com inteligência.
                <br />
                Escale com velocidade.
              </>
            }
            subtitle="Uma plataforma ágil e envolvente para treinar equipes de TI com mais clareza, gamificação corporativa e escala global."
            primaryActionText="Comece Agora"
            primaryActionHref="/signup"
            secondaryActionText="Assistir Demonstração"
            secondaryActionHref="/demo"
          />
        </Box>

        {/* Wave Divider */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            overflow: 'hidden',
            lineHeight: 0,
            transform: 'translateY(1px)', // Prevents gap
            zIndex: 2,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            style={{ position: 'relative', display: 'block', width: '100%', height: '120px' }}
          >
            <path
              d="M0,80 C320,200 420,0 720,80 C1020,160 1120,-20 1440,80 L1440,200 L0,200 Z"
              fill="#FFFFFF"
            />
          </svg>
        </Box>
      </Box>

        <LandingFeatures
        title="Ambiente de Alto Impacto"
        subtitle="Ferramentas essenciais para garantir que cada participante da trilha atinja o sucesso, desde o primeiro login até o diploma final."
        features={features}
      />

      <LandingStats />
      
      <Footer />
    </Box>
  );
}
