'use client';

import { Container, Typography, Button, Box } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Link from 'next/link';

interface LandingHeroProps {
  titlePrimary: React.ReactNode;
  subtitle: string;
  badgeText: string;
  primaryActionText: string;
  primaryActionHref: string;
  secondaryActionText: string;
  secondaryActionHref: string;
}

export function LandingHero({
  titlePrimary,
  subtitle,
  badgeText,
  primaryActionText,
  primaryActionHref,
  secondaryActionText,
  secondaryActionHref,
}: LandingHeroProps) {
  return (
    <Box
      sx={{
        pt: { xs: 8, md: 16 },
        pb: { xs: 8, md: 16 },
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 6, lg: 10 },
          }}
        >
          <Box
            sx={{
              flex: 1,
              maxWidth: '700px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              zIndex: 1,
            }}
          >
            {badgeText && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.5,
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  color: 'secondary.contrastText',
                  borderRadius: 10,
                  mb: 3,
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {badgeText}
                </Typography>
              </Box>
            )}

            <Typography
              variant="h2"
              component="h1"
              sx={{
                mb: 3,
                fontSize: { xs: '3rem', sm: '3.5rem', md: '4rem', lg: '4.5rem' },
                lineHeight: 1.1,
                color: 'secondary.contrastText',
              }}
            >
              {titlePrimary}
            </Typography>

            <Typography
              variant="h6"
              component="p"
              sx={{
                maxWidth: '600px',
                mb: 5,
                lineHeight: 1.6,
                color: 'secondary.contrastText',
                opacity: 0.9,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontWeight: 400,
              }}
            >
              {subtitle}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                component={Link}
                variant="contained"
                size="large"
                color="primary"
                href={primaryActionHref}
                sx={{
                  fontSize: '1rem',
                  borderRadius: 10,
                }}
              >
                {primaryActionText}
              </Button>
              <Button
                component={Link}
                variant="outlined"
                size="large"
                href={secondaryActionHref}
                sx={{
                  fontSize: '1rem',
                  borderWidth: 2,
                  color: 'secondary.contrastText',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: 10,
                  '&:hover': {
                    borderWidth: 2,
                    borderColor: 'secondary.contrastText',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {secondaryActionText}
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              width: '100%',
              maxWidth: '1000px',
              position: 'relative',
              borderRadius: 6,
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
              display: 'flex',
              transform: { md: 'perspective(1000px) rotateY(-5deg)' },
              transition: 'transform 0.5s ease',
              '&:hover': {
                transform: { md: 'perspective(1000px) rotateY(0deg)' },
              },
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1731160807880-daf859b64420?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Pessoas felizes focadas em pair programming"
              sx={{
                width: '100%',
                height: { xs: '300px', md: '500px', lg: '600px' },
                objectFit: 'cover',
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
