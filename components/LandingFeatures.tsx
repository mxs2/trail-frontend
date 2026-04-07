import { Container, Grid, Typography, Box } from '@mui/material';
import { FeatureCard, FeatureType } from './FeatureCard';

interface LandingFeaturesProps {
  title: string;
  subtitle: string;
  features: FeatureType[];
}

export function LandingFeatures({ title, subtitle, features }: LandingFeaturesProps) {
  return (
    <Box sx={{ pb: 12, pt: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 6, md: 8 } }}>
          <Box sx={{ textAlign: 'center', maxWidth: '700px', mx: 'auto', color: 'text.primary' }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2rem', sm: '3rem' } }}
            >
              {title}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
