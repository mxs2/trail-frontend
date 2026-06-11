import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { useStore } from '@/store/useStore';
import { MOCK_TRAILS } from '@/mocks/trails';
import { MOCK_USER } from '@/mocks/user';
import { renderWithTheme } from '../../test/test-utils';

// O dashboard navega via useRouter; sem o runtime do Next, fornecemos um stub.
const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

// O serviço agora fala com o backend via fetch; mockamos a fachada para retornar
// dados determinísticos e evitar requisições reais durante o teste.
vi.mock('@/services/api', () => ({
  api: {
    getWeeklyActivity: vi.fn(async () => [
      { day: 'Seg', mins: 45 },
      { day: 'Ter', mins: 72 },
    ]),
    getPendingCount: vi.fn(async () => 0),
  },
}));

import DashboardPage from '@/app/(app)/dashboard/page';

beforeEach(() => {
  push.mockClear();
  // MOCK_USER tem role 'aluno' — renderiza a visão de estudante.
  useStore.setState({ user: MOCK_USER, trails: MOCK_TRAILS, favorites: [] });
});

describe('DashboardPage', () => {
  // O cabeçalho saúda o usuário pelo primeiro nome e exibe o papel.
  it('saúda o usuário pelo primeiro nome e mostra o papel', async () => {
    renderWithTheme(<DashboardPage />);

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Olá, Matheus.');
    expect(screen.getByText('Aluno')).toBeInTheDocument();
  });

  // A visão de estudante lista as trilhas e o gráfico de atividade semanal.
  it('renderiza as trilhas e a atividade semanal do estudante', async () => {
    renderWithTheme(<DashboardPage />);

    expect(await screen.findByText('Atividade semanal')).toBeInTheDocument();
    expect(screen.getByText('Em andamento')).toBeInTheDocument();
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
  });
});
