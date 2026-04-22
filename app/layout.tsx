import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import Providers from './providers';
import { inter, instrumentSerif, jetbrainsMono } from '../lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trail – Trilhas de Estudo com IA',
  description:
    'Plataforma de trilhas de estudo personalizadas por IA. Parceria Embarque Digital (Porto Digital) × Avanade.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <AppRouterCacheProvider>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
