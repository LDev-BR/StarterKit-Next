import {
  CreditCard,
  FolderKanban,
  KeyRound,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react';

export type AppTab = 'dashboard' | 'projects' | 'billing' | 'settings';

export interface AppNavItem {
  id: AppTab;
  label: string;
  shortLabel: string;
  ariaLabel: string;
  icon: LucideIcon;
}

export const DEFAULT_APP_TAB: AppTab = 'dashboard';

export const APP_NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Painel',
    shortLabel: 'Painel',
    ariaLabel: 'Painel',
    icon: LayoutDashboard,
  },
  {
    id: 'projects',
    label: 'Projetos',
    shortLabel: 'Projetos',
    ariaLabel: 'Projetos',
    icon: FolderKanban,
  },
  {
    id: 'billing',
    label: 'Assinatura',
    shortLabel: 'Plano',
    ariaLabel: 'Assinatura',
    icon: CreditCard,
  },
  {
    id: 'settings',
    label: 'Configurações',
    shortLabel: 'Config',
    ariaLabel: 'Configurações',
    icon: KeyRound,
  },
] as const satisfies readonly AppNavItem[];

export function isAppTab(value: string): value is AppTab {
  return APP_NAV_ITEMS.some((item) => item.id === value);
}
