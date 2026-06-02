import { useStore } from '@/store/useStore';
import { trailFixture } from '../../fixtures/trails';
import { userFixture } from '../../fixtures/user';

describe('useStore', () => {
  describe('toggleLesson', () => {
    it('flips a lesson and recomputes the trail counts by exactly one', () => {
      const trail = useStore.getState().trails[0];
      const target = trail.modules[0].lessons.find((l) => l.done);
      expect(target).toBeDefined();

      // Toggle off, then on — counts are recomputed from the modules each time,
      // so a single toggle must change lessonsDone by exactly one.
      useStore.getState().toggleLesson(trail.id, target!.id);
      const off = useStore.getState().trails[0];
      expect(off.modules[0].lessons.find((l) => l.id === target!.id)?.done).toBe(false);

      useStore.getState().toggleLesson(trail.id, target!.id);
      const on = useStore.getState().trails[0];
      expect(on.lessonsDone).toBe(off.lessonsDone + 1);
      expect(on.progress).toBeGreaterThanOrEqual(0);
      expect(on.progress).toBeLessThanOrEqual(100);
    });

    it('leaves other trails untouched', () => {
      const [first, second] = useStore.getState().trails;
      const secondBefore = JSON.stringify(second);
      useStore.getState().toggleLesson(first.id, first.modules[0].lessons[0].id);
      expect(JSON.stringify(useStore.getState().trails[1])).toBe(secondBefore);
    });
  });

  describe('favorites', () => {
    it('toggles a trail in and out of favorites', () => {
      useStore.getState().toggleFavorite('react-fundamentals');
      expect(useStore.getState().isFavorite('react-fundamentals')).toBe(true);

      useStore.getState().toggleFavorite('react-fundamentals');
      expect(useStore.getState().isFavorite('react-fundamentals')).toBe(false);
    });
  });

  describe('setters', () => {
    it('stores the user, current trail/lesson, recommendation and loading flag', () => {
      const store = useStore.getState();
      store.setUser(userFixture);
      store.setCurrentTrail(trailFixture);
      store.setCurrentLesson(trailFixture.modules[0].lessons[0]);
      store.setAiRecommendation(null);
      store.setIsLoading(true);

      const state = useStore.getState();
      expect(state.user).toEqual(userFixture);
      expect(state.currentTrail).toEqual(trailFixture);
      expect(state.currentLesson?.id).toBe(trailFixture.modules[0].lessons[0].id);
      expect(state.aiRecommendation).toBeNull();
      expect(state.isLoading).toBe(true);
    });

    it('replaces the trails list', () => {
      useStore.getState().setTrails([trailFixture]);
      expect(useStore.getState().trails).toHaveLength(1);
    });
  });
});
