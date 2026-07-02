export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
  avatarUrl?: string;
  createdAt: string;
}

export interface DashboardStats {
  revenue: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  users: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  conversionRate: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  activeSessions: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
}

export interface ActivityLog {
  id: string;
  user: Pick<User, 'name' | 'email' | 'avatarUrl'>;
  action: string;
  target: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  uptime: number;
  services: {
    auth: boolean;
    database: boolean;
    storage: boolean;
  };
}
