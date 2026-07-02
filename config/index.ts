export const SYSTEM_CONFIG = {
  appName: 'Frontend Starter Kit',
  appDescription: 'Starter kit premium para desenvolvimento rápido de interfaces SaaS e portais corporativos.',
  companyName: 'Studio Tech',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.starterkit.dev',
    timeout: 10000,
    isMockEnabled: true, // Chave para alternar entre NestJS real e Mocks offline
  },
  routes: {
    dashboard: '/',
    settings: '/settings',
    analytics: '/analytics',
    forms: '/forms',
  },
} as const;
