import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { api } from '@/services/api';
import type { TrailApiResponse } from '@/services/api';

// O cliente HTTP (lib/api/client) usa o fetch global contra `/api/...`.
// Mockamos o fetch para exercitar a fachada `api` e o mapeamento de dados sem
// depender de um backend real.
const fetchMock = vi.fn();

function okJson(data: unknown, status = 200) {
  return Promise.resolve({
    ok: true,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as Response);
}

function errorResponse(status: number, body = '') {
  return Promise.resolve({
    ok: false,
    status,
    json: async () => (body ? JSON.parse(body) : {}),
    text: async () => body,
  } as Response);
}

const apiTrail: TrailApiResponse = {
  id: 'trail-1',
  name: 'React Fundamentals',
  description: 'Componentes, estado e ciclo de vida',
  createdAt: '2026-01-01T00:00:00Z',
  challengesCount: 12,
  level: 'Iniciante',
  estimatedHours: 18,
};

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockReset();
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('api.getTrails', () => {
  // Mapeia a resposta do backend para o contrato de Trail do frontend.
  it('mapeia a resposta do backend para o formato Trail', async () => {
    fetchMock.mockReturnValueOnce(okJson([apiTrail]));

    const trails = await api.getTrails();

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/trails',
      expect.objectContaining({ headers: expect.any(Object) })
    );
    expect(trails).toHaveLength(1);
    const [t] = trails;
    expect(t.id).toBe('trail-1');
    expect(t.title).toBe('React Fundamentals');
    expect(t.subtitle).toBe('Componentes, estado e ciclo de vida');
    expect(t.lessonsTotal).toBe(12);
    expect(t.hoursTotal).toBe(18);
    expect(t.level).toBe('Iniciante');
    expect(t.color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  // Campos opcionais ausentes recebem defaults seguros.
  it('aplica defaults quando level/estimatedHours vêm nulos', async () => {
    fetchMock.mockReturnValueOnce(okJson([{ ...apiTrail, level: null, estimatedHours: null }]));

    const [t] = await api.getTrails();

    expect(t.level).toBe('Iniciante');
    expect(t.hoursTotal).toBe(0);
  });

  // Inclui o Bearer token no header quando há sessão.
  it('injeta o Authorization header quando há token', async () => {
    localStorage.setItem('trail_token', 'abc123');
    fetchMock.mockReturnValueOnce(okJson([]));

    await api.getTrails();

    const [, options] = fetchMock.mock.calls[0];
    expect((options.headers as Record<string, string>).Authorization).toBe('Bearer abc123');
  });

  // Respostas não-OK propagam um erro.
  it('lança erro quando a resposta não é OK', async () => {
    fetchMock.mockReturnValueOnce(
      errorResponse(500, JSON.stringify({ detail: 'Erro interno do servidor' }))
    );

    await expect(api.getTrails()).rejects.toThrow('Erro interno do servidor');
  });
});
