import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import LandingHero from '@/components/landing/LandingHero';
import { renderWithTheme } from '../../test/test-utils';

describe('LandingHero', () => {
  // O CTA primário deve levar ao cadastro (/signup).
  it('renderiza o CTA primário apontando para /signup', () => {
    renderWithTheme(<LandingHero />);

    const cta = screen.getByRole('link', { name: 'Começar trilha grátis' });
    expect(cta).toHaveAttribute('href', '/signup');
  });

  // O título principal (h1) comunica a proposta de valor.
  it('renderiza o título principal como heading h1', () => {
    renderWithTheme(<LandingHero />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/seu caminho/i);
  });

  // O eyebrow e o subtítulo devem ser exibidos.
  it('exibe o eyebrow e o subtítulo', () => {
    renderWithTheme(<LandingHero />);

    expect(screen.getByText('Trilhas de estudo com IA')).toBeInTheDocument();
    expect(screen.getByText(/Trail gera uma trilha única/i)).toBeInTheDocument();
  });

  // A faixa de métricas deve exibir os três indicadores.
  it('renderiza as métricas da faixa de destaque', () => {
    renderWithTheme(<LandingHero />);

    expect(screen.getByText('3.2k+')).toBeInTheDocument();
    expect(screen.getByText('87%')).toBeInTheDocument();
    expect(screen.getByText('4.9★')).toBeInTheDocument();
  });
});
