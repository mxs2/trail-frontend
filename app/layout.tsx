import type { Metadata } from 'next';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trail – Plataforma de Treinamento em TI',
  description:
    'Escale seu programa de treinamento em TI com um Loop de Feedback Funcional. Reduza o tempo de feedback e identifique os melhores talentos.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
