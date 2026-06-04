import AppShell from '../../components/layout/AppShell';
import RequireRole from '../../components/auth/RequireRole';
import { ErrorBoundary } from '../../components/error/ErrorBoundary';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole role="admin">
      <AppShell>
        <ErrorBoundary>{children}</ErrorBoundary>
      </AppShell>
    </RequireRole>
  );
}
