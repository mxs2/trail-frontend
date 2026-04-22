import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--f-sans',
  display: 'swap',
});

export const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--f-serif',
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--f-mono',
  weight: ['400', '500'],
  display: 'swap',
});
