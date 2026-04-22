// Auth pages manage their own split layout via AuthShell.
// This layout only sets the base background so there's no flash before hydration.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
