import Box from '@mui/material/Box';
import { tokens } from '../../lib/tokens';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: tokens.bg[0],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      {children}
    </Box>
  );
}
