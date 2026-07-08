import { create } from 'zustand';
import { DEFAULT_APP_TAB, type AppTab } from '@/config/navigation';

export interface Project {
  id: string;
  projectName: string;
  projectDescription: string;
  contactEmail: string;
  billingPlan: 'startup' | 'enterprise' | 'custom';
  allocatedBudget: number;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
}

export interface AppConfig {
  apiEndpoint: string;
  dbHost: string;
  dbPort: number;
  dbUser: string;
  mockLatency: number;
  simulateDbFailure: boolean;
}

interface SidebarSlice {
  isOpen: boolean;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  isMobileNotificationsOpen: boolean;
  setMobileNotificationsOpen: (open: boolean) => void;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface NotificationSlice {
  notifications: Notification[];
  addNotification: (message: string, type?: Notification['type']) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface AuthUser {
  email: string;
  name: string;
  role: string;
  token: string;
}

interface AuthSlice {
  user: AuthUser | null;
  authView: 'landing' | 'login' | 'register';
  setAuthView: (view: 'landing' | 'login' | 'register') => void;
  login: (email: string, name: string) => void;
  logout: () => void;
  updateProfile: (name: string, email: string) => void;
}

interface AppConfigSlice {
  config: AppConfig;
  updateConfig: (updater: Partial<AppConfig>) => void;
}

interface ProjectSlice {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Project;
  removeProject: (id: string) => void;
}

interface ApiKeySlice {
  apiKeys: ApiKey[];
  generateApiKey: (name: string) => string;
  revokeApiKey: (id: string) => void;
}

interface ActivitySlice {
  logs: Array<{
    id: string;
    userName: string;
    userEmail: string;
    action: string;
    target: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error';
  }>;
  addLog: (action: string, target: string, status?: 'success' | 'warning' | 'error') => void;
}

export interface SubscriptionSlice {
  subscription: 'free' | 'pro' | 'enterprise';
  setSubscription: (tier: 'free' | 'pro' | 'enterprise') => void;
  apiUsage: number;
  dbUsage: number;
  incrementApiUsage: (amount: number) => void;
}

type AppStateStore = SidebarSlice &
  NotificationSlice &
  AuthSlice &
  AppConfigSlice &
  ProjectSlice &
  ApiKeySlice &
  ActivitySlice &
  SubscriptionSlice;

export const useAppStore = create<AppStateStore>((set, get) => ({
  // Sidebar State
  isOpen: false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  setSidebar: (open) => set({ isOpen: open }),
  isCollapsed: false,
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  currentTab: DEFAULT_APP_TAB,
  setCurrentTab: (tab) => set({ currentTab: tab }),
  isMobileNotificationsOpen: false,
  setMobileNotificationsOpen: (open) => set({ isMobileNotificationsOpen: open }),

  // Notification Toast State
  notifications: [],
  addNotification: (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }],
    }));

    // Auto delete after 5 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 5000);
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),

  // Auth State
  user: null,
  authView: 'landing',
  setAuthView: (view) => set({ authView: view }),
  login: (email, name) => {
    set({
      user: {
        email,
        name,
        role: 'Developer',
        token: `jwt_session_${Math.random().toString(36).substring(2, 12)}`,
      },
      authView: 'landing' // resetting view
    });
    get().addLog('Autenticação rápida realizada', 'Sessão iniciada como ' + name, 'success');
  },
  logout: () => {
    const prevUser = get().user;
    set({ user: null, authView: 'landing' });
    get().addLog('Autenticação encerrada', prevUser ? prevUser.name : 'Visitante', 'warning');
  },
  updateProfile: (name, email) => {
    set((state) => ({
      user: state.user ? { ...state.user, name, email } : null,
    }));
    get().addLog('Perfil de usuário atualizado', `Cadastro sincronizado para ${name}`, 'success');
  },

  // Environment Config Slice
  config: {
    apiEndpoint: 'https://api.dashboard-starter.io/v1',
    dbHost: 'postgresql-primary-cluster',
    dbPort: 5432,
    dbUser: 'starter_admin_usr',
    mockLatency: 300,
    simulateDbFailure: false,
  },
  updateConfig: (updater) =>
    set((state) => {
      const nextConfig = { ...state.config, ...updater };
      return { config: nextConfig };
    }),

  // Projects Slice - prefilled with gorgeous mock projects
  projects: [
    {
      id: 'proj-omega',
      projectName: 'Projeto Ômega Cluster',
      projectDescription: 'Migração de microsserviços legados para arquitetura escalável Kubernetes.',
      contactEmail: 'omega-dev@empresa.com',
      billingPlan: 'enterprise',
      allocatedBudget: 45000,
      createdAt: '2026-06-01T10:00:00Z',
    },
    {
      id: 'proj-nexus',
      projectName: 'Nexus Realtime Gateway',
      projectDescription: 'Mensageria instantânea WebSocket integrada a triggers assíncronos do cluster.',
      contactEmail: 'nexus@cloud.corp',
      billingPlan: 'startup',
      allocatedBudget: 15200,
      createdAt: '2026-06-10T14:30:00Z',
    },
    {
      id: 'proj-sentinel',
      projectName: 'Módulo Sentinel Guard',
      projectDescription: 'Auditoria corporativa interna e conformidade regulatória estrutural.',
      contactEmail: 'sentinel@sec.io',
      billingPlan: 'custom',
      allocatedBudget: 110000,
      createdAt: '2026-06-15T08:15:00Z',
    },
  ],
  addProject: (projData) => {
    const id = `proj-${Math.random().toString(36).substring(2, 8)}`;
    const createdAt = new Date().toISOString();
    const newProjInstance: Project = { ...projData, id, createdAt };
    set((state) => ({
      projects: [newProjInstance, ...state.projects],
    }));
    get().addLog('Novo projeto registrado', newProjInstance.projectName, 'success');
    return newProjInstance;
  },
  removeProject: (id) =>
    set((state) => {
      const targetProj = state.projects.find((p) => p.id === id);
      if (targetProj) {
        get().addLog('Projeto revogado', targetProj.projectName, 'warning');
      }
      return {
        projects: state.projects.filter((p) => p.id !== id),
      };
    }),

  // Mock API Keys Slice
  apiKeys: [
    {
      id: 'key-1',
      name: 'Ambiente Mock Primário',
      key: 'sk_mock_51Nv9uG1S77f7v_visual_validation_key_a',
      createdAt: '2026-06-05T09:12:00Z',
      lastUsed: '2026-06-18T10:20:00Z',
    },
    {
      id: 'key-2',
      name: 'Sandbox Mock',
      key: 'sk_mock_51Nv9uG1S77f7v_visual_validation_key_b',
      createdAt: '2026-06-12T11:45:00Z',
      lastUsed: '2026-06-18T11:15:00Z',
    },
  ],
  generateApiKey: (name) => {
    const id = `key-${Math.random().toString(36).substring(2, 8)}`;
    const randomHex = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const key = `sk_mock_${randomHex.substring(0, 8)}_${randomHex.substring(8, 24)}`;
    const createdAt = new Date().toISOString();
    const newKey: ApiKey = { id, name, key, createdAt, lastUsed: 'Nunca' };
    set((state) => ({
      apiKeys: [newKey, ...state.apiKeys],
    }));
    get().addLog('Nova Chave de API ativada', name, 'success');
    return key;
  },
  revokeApiKey: (id) =>
    set((state) => {
      const targetKey = state.apiKeys.find((k) => k.id === id);
      if (targetKey) {
        get().addLog('Chave de API revogada', targetKey.name, 'warning');
      }
      return {
        apiKeys: state.apiKeys.filter((k) => k.id !== id),
      };
    }),

  // Interactive logs synced with actual user state
  logs: [
    {
      id: 'log-1',
      userName: 'Luis Tavares',
      userEmail: 'luistavares235@gmail.com',
      action: 'Cluster Docker Hub sincronizado',
      target: 'Starter-Kit-Registry',
      timestamp: '2026-06-18T11:12:00Z',
      status: 'success',
    },
    {
      id: 'log-2',
      userName: 'Luis Tavares',
      userEmail: 'luistavares235@gmail.com',
      action: 'Parâmetro de performance editado',
      target: 'Latency set to 300ms',
      timestamp: '2026-06-18T11:05:00Z',
      status: 'success',
    },
  ],
  addLog: (action, target, status = 'success') => {
    const user = get().user;
    const newLog = {
      id: `log-${Math.random().toString(36).substring(2, 8)}`,
      userName: user ? user.name : 'Visitante',
      userEmail: user ? user.email : 'guest-session',
      action,
      target,
      timestamp: new Date().toISOString(),
      status,
    };
    set((state) => ({
      logs: [newLog, ...state.logs.slice(0, 19)], // maintain up to 20 logs
    }));
  },

  // Subscription Slices
  subscription: 'free',
  setSubscription: (tier) => {
    set({ subscription: tier });
    get().addLog('Plano atualizado', `Assinatura alterada para o plano ${tier.toUpperCase()}`, 'success');
  },
  apiUsage: 42500,
  dbUsage: 1.2,
  incrementApiUsage: (amount) => set((state) => ({ apiUsage: Math.min(state.apiUsage + amount, 100000) })),
}));
