import { Trail, User, DashboardMetrics } from '../types';

// Fake Data for Evaluation 1
const MOCK_TRAILS: Trail[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React and components.',
    duration: 120,
    level: 'Beginner',
    status: 'published',
  },
  {
    id: '2',
    title: 'Advanced Next.js',
    description: 'Master SSR, SSG, API routes and App Router.',
    duration: 240,
    level: 'Advanced',
    status: 'published',
  },
  {
    id: '3',
    title: 'UI/UX for Developers',
    description: 'Design concepts for frontend developers.',
    duration: 90,
    level: 'Intermediate',
    status: 'draft',
  },
];

const MOCK_METRICS: DashboardMetrics = {
  totalUsers: 1420,
  activeTrails: 15,
  completionsThisWeek: 89,
};

// Fake API service for Evaluation 1 (Project Theme Context: Training/Trails Platforms)
export const api = {
  // --- Auth (simulated) ---
  async login(email: string): Promise<{ token: string; user: User }> {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            token: 'fake-jwt-token-123',
            user: { id: 'u1', name: 'John Doe', email, role: 'admin' },
          }),
        600
      )
    );
  },

  // --- Trails (The "Main Entity") ---
  async getTrails(): Promise<Trail[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_TRAILS]), 500);
    });
  },

  async getTrailById(id: string): Promise<Trail | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_TRAILS.find((t) => t.id === id));
      }, 500);
    });
  },

  async createTrail(data: Omit<Trail, 'id'>): Promise<Trail> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTrail = { id: Math.random().toString(36).substr(2, 9), ...data };
        MOCK_TRAILS.push(newTrail);
        resolve(newTrail);
      }, 500);
    });
  },

  async updateTrailStatus(id: string, status: Trail['status']): Promise<Trail | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trail = MOCK_TRAILS.find((t) => t.id === id);
        if (trail) {
          trail.status = status;
          resolve(trail);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  // --- Metrics ---
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_METRICS), 400);
    });
  },
};
