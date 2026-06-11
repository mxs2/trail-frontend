import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Trail } from '@/types';
import { renderWithTheme } from '../../test/test-utils';

const mockTrails: Trail[] = [
  { id: '1', title: 'React Fundamentals', description: 'Basics', duration: 120, level: 'Beginner', status: 'published' },
  { id: '2', title: 'Advanced Next.js', description: 'SSR e SSG', duration: 240, level: 'Advanced', status: 'published' },
];

// Mock do serviço para retornar dados controlados imediatamente (sem o timer de 500ms).
vi.mock('@/services/api', () => ({
  api: {
    getTrails: vi.fn(async () => mockTrails),
  },
}));

import TrailsPage from '@/app/trails/page';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('TrailsPage', () => {
  // Teste F25 — Após carregar, a página renderiza os títulos das trilhas
  // retornadas pelo serviço (fluxo busca → render).
  it('renderiza as trilhas após o carregamento', async () => {
    renderWithTheme(<TrailsPage />);

    expect(await screen.findByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Advanced Next.js')).toBeInTheDocument();
  });

  // Teste F26 — O campo de busca filtra as trilhas pelo título.
  it('filtra as trilhas conforme o texto digitado na busca', async () => {
    renderWithTheme(<TrailsPage />);

    await screen.findByText('React Fundamentals');

    const search = screen.getByPlaceholderText('Buscar trilha pelo nome...');
    await userEvent.type(search, 'Next');

    expect(screen.queryByText('React Fundamentals')).not.toBeInTheDocument();
    expect(screen.getByText('Advanced Next.js')).toBeInTheDocument();
  });

  // Teste F27 — Sem correspondência, exibe a mensagem de estado vazio.
  it('exibe mensagem de vazio quando nenhuma trilha corresponde à busca', async () => {
    renderWithTheme(<TrailsPage />);

    await screen.findByText('React Fundamentals');

    const search = screen.getByPlaceholderText('Buscar trilha pelo nome...');
    await userEvent.type(search, 'xyz-sem-resultado');

    expect(screen.getByText('Nenhuma trilha encontrada.')).toBeInTheDocument();
  });
});
