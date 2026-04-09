'use client';

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export interface FeatureType {
  title: string;
  description: string;
  icon: React.ElementType;
}

export function FeatureCard({ title, description, icon: Icon }: FeatureType) {
  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          bgcolor: 'primary.main',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.4s ease',
        },
        '&:hover::before': {
          transform: 'scaleX(1)',
        },
      }}
    >
      <CardContent sx={{ p: 5, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          sx={{
            display: 'inline-flex',
            p: 2,
            mb: 3,
            borderRadius: 0,
            bgcolor: (theme) => `${theme.palette.primary.main}1A`, // 10% opacity hex equivalent
            color: 'primary.main',
            alignSelf: 'flex-start',
            transition: 'transform 0.4s ease',
            '.MuiCard-root:hover &': {
              transform: 'scale(1.1)',
              bgcolor: (theme) => `${theme.palette.primary.main}26`, // 15% opacity hex equivalent
            },
          }}
        >
          <Icon sx={{ fontSize: 36 }} />
        </Box>

        <Typography variant="h5" component="h3" sx={{ mb: 2, color: 'text.primary' }}>
          {title}
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, flexGrow: 1 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
