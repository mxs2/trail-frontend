import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '@/store/useStore';
import type { User } from '@/types';
import { MOCK_TRAILS } from '@/mocks/trails';

// O store Zustand é um singleton de módulo; restauramos o estado inicial antes
// de cada teste para evitar vazamento entre eles.
beforeEach(() => {
  useStore.setState({ user: null, trails: [], favorites: [] });
});

const sampleUser: User = {
  id: 'u1',
  name: 'Ana Beatriz',
  email: 'ana@trail.com',
  role: 'aluno',
  avatarInitials: 'AB',
  level: 1,
  joinedAt: '2025-01-01T00:00:00Z',
};

describe('useStore', () => {
  // setUser atualiza o usuário no estado global.
  it('setUser atualiza o usuário', () => {
    useStore.getState().setUser(sampleUser);

    expect(useStore.getState().user).toEqual(sampleUser);
  });

  // setTrails substitui (não acumula) o array de trilhas.
  it('setTrails substitui o estado anterior', () => {
    const [first] = MOCK_TRAILS;
    useStore.getState().setTrails([first]);

    const trails = useStore.getState().trails;
    expect(trails).toHaveLength(1);
    expect(trails[0].id).toBe(first.id);
  });

  // updateTrailProgress recalcula progress/lessonsDone/lessonsTotal da trilha.
  it('updateTrailProgress recalcula o progresso da trilha', () => {
    const trail = MOCK_TRAILS[0];
    useStore.getState().setTrails([trail]);

    useStore.getState().updateTrailProgress(trail.id, 3, 6);

    const updated = useStore.getState().trails.find((t) => t.id === trail.id)!;
    expect(updated.progress).toBe(50);
    expect(updated.lessonsDone).toBe(3);
    expect(updated.lessonsTotal).toBe(6);
  });

  // updateTrailProgress trata divisão por zero (total 0 => progresso 0).
  it('updateTrailProgress retorna 0% quando não há desafios', () => {
    const trail = MOCK_TRAILS[0];
    useStore.getState().setTrails([trail]);

    useStore.getState().updateTrailProgress(trail.id, 0, 0);

    expect(useStore.getState().trails[0].progress).toBe(0);
  });

  // toggleFavorite adiciona e remove um id; isFavorite reflete o estado.
  it('toggleFavorite alterna o favorito e isFavorite reflete', () => {
    const id = MOCK_TRAILS[0].id;
    expect(useStore.getState().isFavorite(id)).toBe(false);

    useStore.getState().toggleFavorite(id);
    expect(useStore.getState().isFavorite(id)).toBe(true);

    useStore.getState().toggleFavorite(id);
    expect(useStore.getState().isFavorite(id)).toBe(false);
  });
});
