import type { DashboardStats, ActivityLog, SystemHealth } from '@/types';

// Helper de delay para simular o comportamento de chamadas HTTP reais de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class MockApiService {
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(600); // 600ms de delay simulando requisição de rede
    return {
      revenue: {
        value: 142384.50,
        change: 12.4,
        trend: 'up',
      },
      users: {
        value: 12480,
        change: 8.2,
        trend: 'up',
      },
      conversionRate: {
        value: 3.24,
        change: -1.5,
        trend: 'down',
      },
      activeSessions: {
        value: 1845,
        change: 22.1,
        trend: 'up',
      },
    };
  }

  async getActivityLogs(): Promise<ActivityLog[]> {
    await delay(800);
    return [
      {
        id: 'log-1',
        user: {
          name: 'Sarah Connor',
          email: 'sarah@skynet.net',
          avatarUrl: 'https://picsum.photos/seed/sarah/150/150',
        },
        action: 'Atualizou configurações de segurança',
        target: 'Firewall Prod',
        timestamp: 'há 2 minutos',
        status: 'success',
      },
      {
        id: 'log-2',
        user: {
          name: 'John Doe',
          email: 'johndoe@web.com',
          avatarUrl: 'https://picsum.photos/seed/john/150/150',
        },
        action: 'Tentativa de login malsucedida',
        target: 'OAuth Gateway',
        timestamp: 'há 15 minutos',
        status: 'warning',
      },
      {
        id: 'log-3',
        user: {
          name: 'Marcus Wright',
          email: 'marcus@cyberyne.com',
          avatarUrl: 'https://picsum.photos/seed/marcus/150/150',
        },
        action: 'Criou chave de acesso API',
        target: 'Service-Account-Prod',
        timestamp: 'há 1 hora',
        status: 'success',
      },
      {
        id: 'log-4',
        user: {
          name: 'Ellen Ripley',
          email: 'ripley@weyland.com',
          avatarUrl: 'https://picsum.photos/seed/ripley/150/150',
        },
        action: 'Falha crítica de conexão de cluster',
        target: 'USCSS Nostromo',
        timestamp: 'há 2 horas',
        status: 'error',
      },
    ];
  }

  async getSystemHealth(): Promise<SystemHealth> {
    await delay(500);
    return {
      status: 'healthy',
      latency: 48,
      uptime: 99.98,
      services: {
        auth: true,
        database: true,
        storage: true,
      },
    };
  }

  async submitForm(data: Record<string, unknown>): Promise<{ success: boolean; id: string }> {
    await delay(1000);
    console.log('Dados submetidos via Mock:', data);
    return {
      success: true,
      id: `mock-txn-${Math.random().toString(36).substring(2, 9)}`,
    };
  }
}

export const mockDashboardService = new MockApiService();
