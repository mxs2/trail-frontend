import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import LandingFeatures from '@/components/landing/LandingFeatures';
import { renderWithTheme } from '../../test/test-utils';

describe('LandingFeatures', () => {
  // Renderiza um card por pilar — quatro pilares => quatro headings de nível 3.
  it('renderiza um card para cada pilar da plataforma', () => {
    renderWithTheme(<LandingFeatures />);

    expect(screen.getByText('Onboarding inteligente')).toBeInTheDocument();
    expect(screen.getByText('Execução guiada')).toBeInTheDocument();
    expect(screen.getByText('Adaptação contínua')).toBeInTheDocument();
    expect(screen.getByText('Mentoria orientada a dados')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
  });

  // Renderiza o eyebrow e o título (h2) da seção.
  it('renderiza o eyebrow e o título da seção', () => {
    renderWithTheme(<LandingFeatures />);

    expect(screen.getByText('Pilares')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      /como devs realmente aprendem/i
    );
  });
});
