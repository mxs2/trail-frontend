'use client';

// CTA final + rodapé institucional
import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { tokens } from '../../lib/tokens';

export default function LandingFooter() {
  return (
    <>
      {/* CTA final */}
      <Box
        component="section"
        sx={{
          px: { xs: 3, md: 6 },
          pt: { xs: '60px', md: '80px' },
          pb: { xs: '80px', md: '120px' },
          borderTop: `1px solid ${tokens.line.default}`,
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
            gap: 5,
            alignItems: 'center',
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--f-serif)',
              fontWeight: 400,
              fontSize: { xs: '2rem', md: '3.25rem' },
              lineHeight: 1.05,
              color: 'text.primary',
            }}
          >
            Sua próxima trilha começa em 3 minutos.
          </Typography>

          <Box>
            <Typography
              sx={{
                fontSize: 16,
                color: 'text.secondary',
                lineHeight: 1.55,
                mb: 3,
              }}
            >
              Crie sua conta e vamos gerar sua primeira trilha agora.
            </Typography>
            <Button
              component={Link}
              href="/signup"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
            >
              Criar conta
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Rodapé */}
      <Box
        component="footer"
        sx={{
          px: { xs: 3, md: 6 },
          py: 5,
          borderTop: `1px solid ${tokens.line.default}`,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Image
          src="/trail-logo.png"
          alt="Trail"
          width={67}
          height={16}
          style={{ filter: 'brightness(0) invert(1)', opacity: 0.4 }}
        />
        <Typography
          sx={{ ml: 'auto', fontSize: 12, color: tokens.text[3] }}
        >
          © 2026 Trail · Projeto acadêmico Embarque Digital × Avanade
        </Typography>
      </Box>
    </>
  );
}
