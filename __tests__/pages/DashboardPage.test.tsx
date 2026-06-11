import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import type { Trail, DashboardMetrics } from '@/types';
import { renderWithTheme } from '../../test/test-utils';

const mockMetrics: DashboardMetrics = {
  totalUsers: 1420,
  activeTrails: 15,
  completionsThisWeek: 89,
};

const mockTrails: Trail[] = [
  { id: '1', title: 'React Fundamentals', description: 'Basics', duration: 120, level: 'Beginner', status: 'published' },
];

vi.mock('@/services/api', () => ({
  api: {
    getDashboardMetrics: vi.fn(async () => mockMetrics),
    getTrails: vi.fn(async () => mockTrails),
    updateTrailStatus: vi.fn(async () => mockTrails[0]),
  },
}));

import DashboardPage from '@/app/dashboard/page';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('DashboardPage', () => {
  // Teste F28 — Os valores das métricas retornadas pelo serviço aparecem no DOM.
  it('exibe os valores das métricas do dashboard', async () => {
    renderWithTheme(<DashboardPage />);

    expect(await screen.findByText('1420')).toBeInTheDocument(); // total de usuários
    expect(screen.getByText('15')).toBeInTheDocument(); // trilhas ativas
    expect(screen.getByText('89')).toBeInTheDocument(); // conclusões na semana
  });

  // Teste F29 — A tabela de gerenciamento lista as trilhas retornadas.
  it('lista as trilhas na tabela de gerenciamento', async () => {
    renderWithTheme(<DashboardPage />);

    expect(await screen.findByText('React Fundamentals')).toBeInTheDocument();
    // Botão de ação por linha
    expect(screen.getByRole('button', { name: 'Alternar Status' })).toBeInTheDocument();
  });
});
