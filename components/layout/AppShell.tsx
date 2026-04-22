import Box from '@mui/material/Box';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar';
import Topbar from './Topbar';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `${SIDEBAR_WIDTH}px 1fr`,
        minHeight: '100vh',
      }}
    >
      <Sidebar />

      {/* Main column: sticky topbar + scrollable content */}
      <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <Box
          component="main"
          sx={{
            flex: 1,
            px: 5,
            pt: '36px',
            pb: 10,
            maxWidth: 1200,
            width: '100%',
            mx: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
