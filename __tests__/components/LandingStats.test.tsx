import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import LandingStats from '@/components/landing/LandingStats';
import { renderWithTheme } from '../../test/test-utils';

describe('LandingStats', () => {
  // A seção "Como funciona" lista os três passos numerados.
  it('renderiza os três passos do "Como funciona"', () => {
    renderWithTheme(<LandingStats />);

    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();

    expect(screen.getByText('Conte seu objetivo')).toBeInTheDocument();
    expect(screen.getByText('Receba sua trilha')).toBeInTheDocument();
    expect(screen.getByText('Avance no seu ritmo')).toBeInTheDocument();
  });

  // O depoimento deve exibir o autor e seu cargo.
  it('renderiza o depoimento com o autor', () => {
    renderWithTheme(<LandingStats />);

    expect(screen.getByText('Ana Beatriz Costa')).toBeInTheDocument();
    expect(screen.getByText(/Jr\. Frontend/i)).toBeInTheDocument();
  });
});
