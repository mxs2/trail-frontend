import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { LandingHero } from '@/components/LandingHero';
import { renderWithTheme } from '../../test/test-utils';

const baseProps = {
  titlePrimary: 'Aprenda na prática',
  subtitle: 'Trilhas guiadas por IA e mentoria.',
  badgeText: 'Powered by IA',
  primaryActionText: 'Começar agora',
  primaryActionHref: '/trails',
  secondaryActionText: 'Saiba mais',
  secondaryActionHref: '/sobre',
};

describe('LandingHero', () => {
  // Teste F7 — O CTA primário deve renderizar com o texto e href corretos.
  it('renderiza o botão de ação primária com texto e href corretos', () => {
    renderWithTheme(<LandingHero {...baseProps} />);

    const cta = screen.getByRole('link', { name: 'Começar agora' });
    expect(cta).toHaveAttribute('href', '/trails');
  });

  // Teste F8 — A ação secundária deve apontar para o href informado.
  it('renderiza o botão de ação secundária com o href informado', () => {
    renderWithTheme(<LandingHero {...baseProps} />);

    const secondary = screen.getByRole('link', { name: 'Saiba mais' });
    expect(secondary).toHaveAttribute('href', '/sobre');
  });

  // Teste F9 — Subtítulo e badge devem ser exibidos.
  it('exibe o subtítulo e o texto do badge', () => {
    renderWithTheme(<LandingHero {...baseProps} />);

    expect(screen.getByText('Trilhas guiadas por IA e mentoria.')).toBeInTheDocument();
    expect(screen.getByText('Powered by IA')).toBeInTheDocument();
  });
});
