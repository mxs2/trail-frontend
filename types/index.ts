export interface Trail {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'draft' | 'published' | 'archived';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface DashboardMetrics {
  totalUsers: number;
  activeTrails: number;
  completionsThisWeek: number;
}
