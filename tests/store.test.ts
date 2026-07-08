import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { APP_NAV_ITEMS, DEFAULT_APP_TAB } from '@/config/navigation';
import { useAppStore } from '@/lib/store';
import { resetAppStore } from './store-test-utils';

describe('useAppStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetAppStore();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    resetAppStore();
  });

  it('manages the mock auth lifecycle and profile updates', () => {
    useAppStore.getState().login('dev@starterkit.io', 'Dev User');

    expect(useAppStore.getState().user).toMatchObject({
      email: 'dev@starterkit.io',
      name: 'Dev User',
      role: 'Developer',
    });
    expect(useAppStore.getState().user?.token).toMatch(/^jwt_session_/);
    expect(useAppStore.getState().logs[0]).toMatchObject({
      userName: 'Dev User',
      status: 'success',
    });

    useAppStore.getState().updateProfile('Dev Updated', 'updated@starterkit.io');

    expect(useAppStore.getState().user).toMatchObject({
      email: 'updated@starterkit.io',
      name: 'Dev Updated',
    });

    useAppStore.getState().logout();

    expect(useAppStore.getState().user).toBeNull();
    expect(useAppStore.getState().authView).toBe('landing');
    expect(useAppStore.getState().logs[0].status).toBe('warning');
  });

  it('adds, removes, clears and expires notifications', () => {
    useAppStore.getState().addNotification('Configuração salva', 'info');

    const [notification] = useAppStore.getState().notifications;
    expect(notification).toMatchObject({
      message: 'Configuração salva',
      type: 'info',
    });

    useAppStore.getState().removeNotification(notification.id);
    expect(useAppStore.getState().notifications).toHaveLength(0);

    useAppStore.getState().addNotification('Projeto criado', 'success');
    useAppStore.getState().addNotification('Falha simulada', 'error');
    expect(useAppStore.getState().notifications).toHaveLength(2);

    useAppStore.getState().clearNotifications();
    expect(useAppStore.getState().notifications).toHaveLength(0);

    useAppStore.getState().addNotification('Expira automaticamente', 'warning');
    vi.advanceTimersByTime(5000);
    expect(useAppStore.getState().notifications).toHaveLength(0);
  });

  it('manages project creation, removal and mock config updates', () => {
    const initialProjectCount = useAppStore.getState().projects.length;

    const created = useAppStore.getState().addProject({
      projectName: 'Portal Operacional',
      projectDescription: 'Fluxo visual validado para a fase frontend.',
      contactEmail: 'ops@starterkit.io',
      billingPlan: 'startup',
      allocatedBudget: 2500,
    });

    expect(created.id).toMatch(/^proj-/);
    expect(useAppStore.getState().projects).toHaveLength(initialProjectCount + 1);
    expect(useAppStore.getState().projects[0]).toMatchObject({
      projectName: 'Portal Operacional',
      contactEmail: 'ops@starterkit.io',
    });

    useAppStore.getState().removeProject(created.id);
    expect(useAppStore.getState().projects).toHaveLength(initialProjectCount);
    expect(useAppStore.getState().logs[0]).toMatchObject({
      target: 'Portal Operacional',
      status: 'warning',
    });

    useAppStore.getState().updateConfig({
      apiEndpoint: 'http://localhost:3000/api',
      simulateDbFailure: true,
    });

    expect(useAppStore.getState().config).toMatchObject({
      apiEndpoint: 'http://localhost:3000/api',
      simulateDbFailure: true,
    });
  });

  it('manages API keys, subscription and usage counters', () => {
    const initialKeyCount = useAppStore.getState().apiKeys.length;

    const key = useAppStore.getState().generateApiKey('Preview Gateway');

    expect(key).toMatch(/^sk_mock_/);
    expect(useAppStore.getState().apiKeys).toHaveLength(initialKeyCount + 1);
    expect(useAppStore.getState().apiKeys.every((apiKey) => apiKey.key.startsWith('sk_mock_'))).toBe(true);
    expect(useAppStore.getState().apiKeys[0]).toMatchObject({
      name: 'Preview Gateway',
      lastUsed: 'Nunca',
    });

    const generatedId = useAppStore.getState().apiKeys[0].id;
    useAppStore.getState().revokeApiKey(generatedId);

    expect(useAppStore.getState().apiKeys).toHaveLength(initialKeyCount);
    expect(useAppStore.getState().logs[0]).toMatchObject({
      target: 'Preview Gateway',
      status: 'warning',
    });

    useAppStore.getState().setSubscription('pro');
    useAppStore.getState().incrementApiUsage(1000000);

    expect(useAppStore.getState().subscription).toBe('pro');
    expect(useAppStore.getState().apiUsage).toBe(100000);
  });

  it('keeps app navigation centralized and typed in the store', () => {
    expect(DEFAULT_APP_TAB).toBe('dashboard');
    expect(APP_NAV_ITEMS.map((item) => item.id)).toEqual([
      'dashboard',
      'projects',
      'billing',
      'settings',
    ]);

    useAppStore.getState().setCurrentTab('billing');

    expect(useAppStore.getState().currentTab).toBe('billing');
  });
});
