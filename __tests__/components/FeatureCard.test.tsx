import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { FeatureCard } from '@/components/FeatureCard';
import { renderWithTheme } from '../../test/test-utils';

// Ícone de teste para verificar que o componente renderiza o ícone recebido.
function DummyIcon() {
  return <svg data-testid="dummy-icon" />;
}

describe('FeatureCard', () => {
  // Teste F1 — Título e descrição recebidos via props devem aparecer no DOM.
  it('renderiza o título e a descrição passados por props', () => {
    renderWithTheme(
      <FeatureCard title="Autenticação" description="Login seguro com JWT" icon={DummyIcon} />
    );

    expect(screen.getByText('Autenticação')).toBeInTheDocument();
    expect(screen.getByText('Login seguro com JWT')).toBeInTheDocument();
  });

  // Teste F2 — O ícone passado por prop deve ser renderizado.
  it('renderiza o ícone fornecido', () => {
    renderWithTheme(<FeatureCard title="X" description="Y" icon={DummyIcon} />);

    expect(screen.getByTestId('dummy-icon')).toBeInTheDocument();
  });

  // Teste F3 — O título deve ser um heading de nível 3 (semântica/acessibilidade).
  it('expõe o título como heading h3', () => {
    renderWithTheme(<FeatureCard title="Título Acessível" description="desc" icon={DummyIcon} />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Título Acessível');
  });
});
