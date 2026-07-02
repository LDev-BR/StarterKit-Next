import { SYSTEM_CONFIG } from '@/config';
import { mockDashboardService } from './mock-service';
import type { DashboardStats, ActivityLog, SystemHealth } from '@/types';

// O contrato (Repository Pattern) que mapeia todas as requisições de dados
export interface IApiService {
  getDashboardStats(): Promise<DashboardStats>;
  getActivityLogs(): Promise<ActivityLog[]>;
  getSystemHealth(): Promise<SystemHealth>;
  submitForm(data: Record<string, unknown>): Promise<{ success: boolean; id: string }>;
}

// Implementação real que faria requisições ao NestJS no futuro
class RealApiService implements IApiService {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${SYSTEM_CONFIG.api.baseUrl}/dashboard/stats`);
    if (!response.ok) throw new Error('Falha no fetch real de dados');
    return response.json();
  }

  async getActivityLogs(): Promise<ActivityLog[]> {
    const response = await fetch(`${SYSTEM_CONFIG.api.baseUrl}/logs`);
    if (!response.ok) throw new Error('Falha no fetch real de logs');
    return response.json();
  }

  async getSystemHealth(): Promise<SystemHealth> {
    const response = await fetch(`${SYSTEM_CONFIG.api.baseUrl}/health`);
    if (!response.ok) throw new Error('Falha no status de saúde');
    return response.json();
  }

  async submitForm(data: Record<string, unknown>): Promise<{ success: boolean; id: string }> {
    const response = await fetch(`${SYSTEM_CONFIG.api.baseUrl}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Falha ao submeter');
    return response.json();
  }
}

// Injeção de dependência sob demanda baseado na chave isMockEnabled do config:
export const api: IApiService = SYSTEM_CONFIG.api.isMockEnabled
  ? mockDashboardService
  : new RealApiService();
