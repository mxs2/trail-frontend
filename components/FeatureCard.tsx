import { Card, CardContent, Typography, Box } from '@mui/material';

export interface FeatureType {
  title: string;
  description: string;
  icon: React.ElementType;
}

export function FeatureCard({ title, description, icon: Icon }: FeatureType) {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        bgcolor: '#FFFFFF',
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 4,
        color: 'text.primary',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          opacity: 0,
          transition: 'opacity 0.4s ease',
        },
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 16px 32px rgba(0, 0, 0, 0.08)',
          borderColor: 'transparent',
          '&::before': {
            opacity: 1,
          },
        },
      }}
    >
      <CardContent sx={{ p: 5, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
          <Box
            sx={{
              p: 2,
              display: 'inline-flex',
              borderRadius: '16px',
              bgcolor: (theme) => `${theme.palette.primary.main}1A`,
              color: 'primary.main',
              width: 'fit-content',
              transition: 'transform 0.4s ease',
              '.MuiCard-root:hover &': {
                transform: 'scale(1.1)',
                bgcolor: (theme) => `${theme.palette.primary.main}2A`,
              }
            }}
          >
            <Icon sx={{ fontSize: 36 }} />
          </Box>
          <Box sx={{ mt: 1, flex: 1 }}>
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              sx={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.01em' }}
            >
              {title}
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary', fontSize: '1.05rem' }}>
              {description}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
