import { Inter, JetBrains_Mono } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--f-sans',
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--f-mono',
  weight: ['400', '500'],
  display: 'swap',
});
