import { describe, it, expect } from 'vitest';
import { api } from '@/services/api';

describe('api (serviço mockado)', () => {
  // Teste F16 — getTrails deve retornar um array onde cada item respeita o
  // contrato de dados (id, title, level, status). Serve de âncora para quando
  // a integração real com o backend substituir o mock.
  it('getTrails retorna trilhas no formato esperado', async () => {
    const trails = await api.getTrails();

    expect(Array.isArray(trails)).toBe(true);
    expect(trails.length).toBeGreaterThan(0);
    for (const t of trails) {
      expect(typeof t.id).toBe('string');
      expect(typeof t.title).toBe('string');
      expect(['Beginner', 'Intermediate', 'Advanced']).toContain(t.level);
      expect(['draft', 'published', 'archived']).toContain(t.status);
    }
  });

  // Teste F17 — getTrailById retorna a trilha correta para um id existente.
  it('getTrailById retorna a trilha correspondente ao id', async () => {
    const trail = await api.getTrailById('1');

    expect(trail).toBeDefined();
    expect(trail?.id).toBe('1');
  });

  // Teste F18 — getTrailById retorna undefined para id inexistente.
  it('getTrailById retorna undefined quando o id não existe', async () => {
    const trail = await api.getTrailById('id-inexistente');

    expect(trail).toBeUndefined();
  });

  // Teste F19 — createTrail gera um id e preserva os dados enviados.
  it('createTrail retorna nova trilha com id gerado e dados preservados', async () => {
    const created = await api.createTrail({
      title: 'Trilha de Testes',
      description: 'Criada no teste',
      duration: 60,
      level: 'Beginner',
      status: 'draft',
    });

    expect(created.id).toBeTruthy();
    expect(created.title).toBe('Trilha de Testes');
    expect(created.status).toBe('draft');

    // A trilha criada passa a ser recuperável pelo serviço.
    const fetched = await api.getTrailById(created.id);
    expect(fetched?.title).toBe('Trilha de Testes');
  });

  // Teste F20 — updateTrailStatus altera o status de uma trilha existente e
  // retorna null para id inexistente.
  it('updateTrailStatus atualiza existente e retorna null para id inexistente', async () => {
    const updated = await api.updateTrailStatus('1', 'archived');
    expect(updated).not.toBeNull();
    expect(updated?.status).toBe('archived');

    const missing = await api.updateTrailStatus('id-inexistente', 'published');
    expect(missing).toBeNull();
  });

  // Teste F21 — login retorna token e ecoa o email no usuário autenticado.
  it('login retorna token e usuário com o email informado', async () => {
    const result = await api.login('aluno@trail.com');

    expect(result.token).toBeTruthy();
    expect(result.user.email).toBe('aluno@trail.com');
  });
});
