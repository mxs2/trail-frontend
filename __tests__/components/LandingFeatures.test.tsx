import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { LandingFeatures } from '@/components/LandingFeatures';
import type { FeatureType } from '@/components/FeatureCard';
import { renderWithTheme } from '../../test/test-utils';

function Icon() {
  return <svg />;
}

const features: FeatureType[] = [
  { title: 'Autenticação', description: 'Login com JWT', icon: Icon },
  { title: 'Submissões', description: 'Entrega via link do GitHub', icon: Icon },
  { title: 'Métricas', description: 'KPIs em tempo real', icon: Icon },
];

describe('LandingFeatures', () => {
  // Teste F12 — Renderiza um card por feature fornecida.
  it('renderiza um card para cada feature', () => {
    renderWithTheme(<LandingFeatures title="Recursos" subtitle="O que oferecemos" features={features} />);

    expect(screen.getByText('Autenticação')).toBeInTheDocument();
    expect(screen.getByText('Submissões')).toBeInTheDocument();
    expect(screen.getByText('Métricas')).toBeInTheDocument();
    // três cards => três headings de nível 3
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  });

  // Teste F13 — Renderiza o título e o subtítulo da seção.
  it('renderiza o título e o subtítulo da seção', () => {
    renderWithTheme(<LandingFeatures title="Recursos" subtitle="O que oferecemos" features={features} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Recursos' })).toBeInTheDocument();
    expect(screen.getByText('O que oferecemos')).toBeInTheDocument();
  });
});
