import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '@/store/useStore';
import type { Trail, User } from '@/types';

// O store Zustand é um singleton de módulo; restauramos o estado inicial antes
// de cada teste para evitar vazamento entre eles.
beforeEach(() => {
  useStore.setState({ user: null, trails: [], isLoading: false });
});

const sampleTrail: Trail = {
  id: '1',
  title: 'React',
  description: 'desc',
  duration: 60,
  level: 'Beginner',
  status: 'published',
};

describe('useStore', () => {
  // Teste F22 — setUser atualiza o usuário no estado global.
  it('setUser atualiza o usuário', () => {
    const user: User = { id: 'u1', name: 'Ana', email: 'ana@trail.com', role: 'admin' };

    useStore.getState().setUser(user);

    expect(useStore.getState().user).toEqual(user);
  });

  // Teste F23 — setTrails substitui (não acumula) o array de trilhas.
  it('setTrails substitui o estado anterior', () => {
    useStore.getState().setTrails([sampleTrail]);
    useStore.getState().setTrails([{ ...sampleTrail, id: '2', title: 'Next.js' }]);

    const trails = useStore.getState().trails;
    expect(trails).toHaveLength(1);
    expect(trails[0].id).toBe('2');
  });

  // Teste F24 — setIsLoading alterna a flag de carregamento.
  it('setIsLoading alterna a flag de carregamento', () => {
    expect(useStore.getState().isLoading).toBe(false);

    useStore.getState().setIsLoading(true);
    expect(useStore.getState().isLoading).toBe(true);
  });
});
