import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { useStore } from '@/store/useStore';
import { MOCK_TRAILS } from '@/mocks/trails';
import { MOCK_USER } from '@/mocks/user';
import { renderWithTheme } from '../../test/test-utils';

// A página de progresso usa useRouter para "Continuar"; stub sem o runtime do Next.
const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

// Mockamos a fachada de API para fornecer a atividade semanal sem backend.
vi.mock('@/services/api', () => ({
  api: {
    getWeeklyActivity: vi.fn(async () => [
      { day: 'Seg', mins: 45 },
      { day: 'Ter', mins: 72 },
    ]),
  },
}));

import ProgressoPage from '@/app/(app)/progresso/page';

beforeEach(() => {
  push.mockClear();
  useStore.setState({ user: MOCK_USER, trails: MOCK_TRAILS, favorites: [] });
});

describe('ProgressoPage', () => {
  // O cabeçalho da página de progresso.
  it('renderiza o cabeçalho "Seu progresso"', async () => {
    renderWithTheme(<ProgressoPage />);

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Seu progresso');
    expect(screen.getByText('Acompanhe sua evolução nas trilhas')).toBeInTheDocument();
  });

  // Lista as trilhas em andamento a partir do store.
  it('lista as trilhas em andamento', async () => {
    renderWithTheme(<ProgressoPage />);

    expect(await screen.findByText('Em andamento')).toBeInTheDocument();
    expect(screen.getAllByText('React Fundamentals').length).toBeGreaterThan(0);
  });

  // Renderiza a seção de conquistas com seus marcos.
  it('renderiza a seção de conquistas', async () => {
    renderWithTheme(<ProgressoPage />);

    expect(await screen.findByText('Conquistas')).toBeInTheDocument();
    expect(screen.getByText('Primeira trilha')).toBeInTheDocument();
  });
});
