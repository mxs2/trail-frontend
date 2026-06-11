import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import React from 'react';

// O next/link do App Router depende de contexto de roteamento do Next que não
// existe em jsdom. Substituímos por uma âncora simples para que os testes possam
// inspecionar texto e href sem precisar montar o runtime do Next.
vi.mock('next/link', () => ({
  __esModule: true,
  default: React.forwardRef<HTMLAnchorElement, { children?: React.ReactNode; href?: unknown }>(
    function MockLink({ children, href, ...rest }, ref) {
      return React.createElement(
        'a',
        { ref, href: typeof href === 'string' ? href : '#', ...rest },
        children
      );
    }
  ),
}));

// Limpa o DOM montado entre os testes para evitar vazamento de estado.
afterEach(() => {
  cleanup();
});
