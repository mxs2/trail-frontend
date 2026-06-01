'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Logo from '../../../components/ui/Logo';
import { tokens } from '../../../lib/tokens';
import { MOCK_TRAILS } from '../../../mocks/trails';

export default function ExplorarPage() {
  const router = useRouter();

  return (
    <Box
      sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          px: { xs: 3, md: 6 },
          py: 2.75,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: `1px solid ${tokens.line.default}`,
        }}
      >
        <Logo />
        <Button
          variant="text"
          onClick={() => router.push('/dashboard')}
          sx={{ ml: 'auto', color: tokens.text[2], fontSize: '0.8125rem', textTransform: 'none' }}
        >
          Entrar no app →
        </Button>
      </Box>

      {/* Body */}
      <Box
        sx={{
          flex: 1,
          px: { xs: 3, md: 6 },
          py: { xs: 5, md: 8 },
          maxWidth: 1140,
          mx: 'auto',
          width: '100%',
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontFamily: 'var(--f-serif)',
            fontSize: { xs: '2rem', md: '2.875rem' },
            fontWeight: 400,
            lineHeight: 1.1,
            mb: 1,
          }}
        >
          Trilhas disponíveis
        </Typography>
        <Typography sx={{ color: 'text.disabled', fontSize: '0.9375rem', mb: 5 }}>
          Escolha uma trilha para começar. Você pode mudar ou adicionar mais a qualquer momento.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {MOCK_TRAILS.map((trail) => (
            <Box
              key={trail.id}
              onClick={() => router.push('/dashboard')}
              sx={{
                p: 3,
                bgcolor: tokens.bg[3],
                border: `1px solid ${tokens.line.default}`,
                borderRadius: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                transition: 'border-color 140ms, background 140ms',
                '&:hover': {
                  borderColor: `${trail.color}60`,
                  bgcolor: tokens.bg[4],
                },
              }}
            >
              {/* Color icon + level */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    bgcolor: `${trail.color}20`,
                    border: `1px solid ${trail.color}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box sx={{ width: 14, height: 14, borderRadius: '3px', bgcolor: trail.color }} />
                </Box>
                <Box
                  sx={{
                    px: '8px',
                    py: '3px',
                    borderRadius: '6px',
                    bgcolor: tokens.bg[0],
                    border: `1px solid ${tokens.line.strong}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.6875rem',
                      color: tokens.text[2],
                      fontFamily: 'var(--f-mono)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {trail.level}
                  </Typography>
                </Box>
              </Box>

              {/* Title & subtitle */}
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '1.0625rem', mb: 0.5 }}>
                  {trail.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.8125rem',
                    color: tokens.text[2],
                    lineHeight: 1.45,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {trail.subtitle}
                </Typography>
              </Box>

              {/* Meta */}
              <Box sx={{ display: 'flex', gap: 2, pt: 0.5, borderTop: `1px solid ${tokens.line.default}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: tokens.text[2] }}>
                  <LayersOutlinedIcon sx={{ fontSize: 13 }} />
                  <Typography sx={{ fontSize: '0.75rem' }}>
                    {trail.modules.length} módulos
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: tokens.text[2] }}>
                  <AccessTimeOutlinedIcon sx={{ fontSize: 13 }} />
                  <Typography sx={{ fontSize: '0.75rem' }}>{trail.hoursTotal}h</Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                size="small"
                endIcon={<ArrowForwardIcon sx={{ fontSize: '12px !important' }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/dashboard');
                }}
                sx={{
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  bgcolor: trail.color,
                  '&:hover': { bgcolor: trail.color, filter: 'brightness(0.9)' },
                }}
              >
                Começar trilha
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
