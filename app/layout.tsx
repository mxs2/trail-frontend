import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import Providers from './providers';
import Navbar from '../components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trail – Plataforma de Treinamento em TI',
  description:
    'Escale seu programa de treinamento em TI com um Loop de Feedback Funcional. Reduza o tempo de feedback e identifique os melhores talentos.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-gray-50 text-gray-900 min-h-screen flex flex-col"
      >
        <AppRouterCacheProvider>
          <Providers>
            <Navbar />
            <main className="flex-grow">{children}</main>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
