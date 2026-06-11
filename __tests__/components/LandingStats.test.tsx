import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { LandingStats } from '@/components/LandingStats';
import { renderWithTheme } from '../../test/test-utils';

describe('LandingStats', () => {
  // Teste F10 — Todos os valores de estatística devem ser exibidos.
  it('renderiza os quatro valores de estatística', () => {
    renderWithTheme(<LandingStats />);

    expect(screen.getByText('10k+')).toBeInTheDocument();
    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText('99%')).toBeInTheDocument();
    expect(screen.getByText('24/7')).toBeInTheDocument();
  });

  // Teste F11 — Os rótulos correspondentes também devem aparecer.
  it('renderiza os rótulos das estatísticas', () => {
    renderWithTheme(<LandingStats />);

    expect(screen.getByText('Desenvolvedores Capacitados')).toBeInTheDocument();
    expect(screen.getByText('Empresas Parceiras')).toBeInTheDocument();
    expect(screen.getByText('Taxa de Satisfação')).toBeInTheDocument();
    expect(screen.getByText('Suporte Global')).toBeInTheDocument();
  });
});
