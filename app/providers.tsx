'use client';

import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import ptBRTranslations from '@shopify/polaris/locales/pt-BR.json';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AppProvider i18n={ptBRTranslations}>
      {children}
    </AppProvider>
  );
}
