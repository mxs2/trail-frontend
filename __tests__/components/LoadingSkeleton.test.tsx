import { describe, it, expect } from 'vitest';
import { FeatureCardSkeleton, TrailsSkeleton } from '@/components/LoadingSkeleton';
import { renderWithTheme } from '../../test/test-utils';

describe('LoadingSkeleton', () => {
  // Teste F14 — O skeleton de card de feature renderiza placeholders visuais
  // (elementos Skeleton do MUI), garantindo que o estado de carregamento não
  // fique vazio.
  it('FeatureCardSkeleton renderiza placeholders de skeleton', () => {
    const { container } = renderWithTheme(<FeatureCardSkeleton />);

    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  // Teste F15 — O skeleton da listagem de trilhas renderiza os 6 cards de
  // placeholder previstos no grid.
  it('TrailsSkeleton renderiza seis cards de placeholder', () => {
    const { container } = renderWithTheme(<TrailsSkeleton />);

    // Cada TrailCardSkeleton contém um Skeleton de imagem/título distinto;
    // contamos os contêineres MuiCard-root renderizados no grid.
    const cards = container.querySelectorAll('.MuiCard-root');
    expect(cards.length).toBe(6);
  });
});
