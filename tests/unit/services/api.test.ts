import { api } from '@/services/api';

// services/api uses setTimeout to mimic latency — fake timers keep tests fast
// and deterministic (no real waiting, no hardcoded sleeps).
describe('api service', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('getTrails resolves the full trail catalogue', async () => {
    const promise = api.getTrails();
    await jest.advanceTimersByTimeAsync(500);
    const trails = await promise;
    expect(trails.length).toBeGreaterThan(0);
    expect(trails[0]).toHaveProperty('id');
  });

  it('getTrailById returns the matching trail', async () => {
    const promise = api.getTrailById('react-fundamentals');
    await jest.advanceTimersByTimeAsync(500);
    await expect(promise).resolves.toMatchObject({ id: 'react-fundamentals' });
  });

  it('getTrailById resolves undefined for an unknown id', async () => {
    const promise = api.getTrailById('does-not-exist');
    await jest.advanceTimersByTimeAsync(500);
    await expect(promise).resolves.toBeUndefined();
  });

  it('login resolves a user', async () => {
    const promise = api.login('matheus.silva@trail.dev', 'secret');
    await jest.advanceTimersByTimeAsync(600);
    await expect(promise).resolves.toHaveProperty('email');
  });

  it('register derives avatar initials from the provided name', async () => {
    const promise = api.register('Ana Paula', 'ana@trail.dev', 'secret123');
    await jest.advanceTimersByTimeAsync(800);
    await expect(promise).resolves.toMatchObject({ name: 'Ana Paula', avatarInitials: 'AP' });
  });

  it('requestPasswordReset acknowledges the request', async () => {
    const promise = api.requestPasswordReset('ana@trail.dev');
    await jest.advanceTimersByTimeAsync(600);
    await expect(promise).resolves.toEqual({ ok: true });
  });

  it('getUser resolves the current user', async () => {
    const promise = api.getUser();
    await jest.advanceTimersByTimeAsync(300);
    await expect(promise).resolves.toHaveProperty('role');
  });

  it('getWeeklyActivity resolves seven days of activity', async () => {
    const promise = api.getWeeklyActivity();
    await jest.advanceTimersByTimeAsync(300);
    await expect(promise).resolves.toHaveLength(7);
  });

  it('getLessonById finds a nested lesson', async () => {
    const promise = api.getLessonById('rf-m0-l0');
    await jest.advanceTimersByTimeAsync(400);
    await expect(promise).resolves.toMatchObject({ id: 'rf-m0-l0' });
  });

  it('getLessonById resolves undefined for an unknown lesson', async () => {
    const promise = api.getLessonById('nope');
    await jest.advanceTimersByTimeAsync(400);
    await expect(promise).resolves.toBeUndefined();
  });

  it('getPersonalizedTrail resolves a personalized trail with a recommendation', async () => {
    const promise = api.getPersonalizedTrail('u1');
    await jest.advanceTimersByTimeAsync(1200);
    await expect(promise).resolves.toHaveProperty('recommendation');
  });
});
