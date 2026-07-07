import { useAppStore } from '@/lib/store';

const initialState = useAppStore.getState();

export function resetAppStore() {
  useAppStore.setState({
    isOpen: false,
    isCollapsed: false,
    currentTab: 'dashboard',
    isMobileNotificationsOpen: false,
    notifications: [],
    user: null,
    authView: 'landing',
    config: { ...initialState.config },
    projects: initialState.projects.map((project) => ({ ...project })),
    apiKeys: initialState.apiKeys.map((apiKey) => ({ ...apiKey })),
    logs: initialState.logs.map((log) => ({ ...log })),
    subscription: 'free',
    apiUsage: initialState.apiUsage,
    dbUsage: initialState.dbUsage,
  });
}
