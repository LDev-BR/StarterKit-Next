'use client';

import React from 'react';
import { MainContent } from '@/components/layouts/main-content';
import { ShowcaseDashboard } from '@/features/showcase/dashboard/showcase-dashboard';
import { FormShowcase } from '@/features/showcase/projects/form-showcase';
import { BillingShowcase } from '@/features/showcase/billing/billing-showcase';
import { AuthShowcase } from '@/features/showcase/auth/auth-showcase';
import { SettingsShowcase } from '@/features/showcase/settings/settings-showcase';
import { LandingPage } from '@/features/showcase/landing/landing-page';
import { PageTransition } from '@/components/animations/motion-presets';
import { useAppStore } from '@/lib/store';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Key, 
  CreditCard 
} from 'lucide-react';

export default function Home() {
  const { user, authView, currentTab, setCurrentTab } = useAppStore();

  // Unified menu items representing real-world standard options
  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'projects', label: 'Projetos', icon: FolderKanban },
    { id: 'billing', label: 'Assinatura', icon: CreditCard },
    { id: 'settings', label: 'Configurações', icon: Key },
  ] as const;

  // Render the unauthenticated flow if no active JWT session is parsed
  if (!user) {
    if (authView === 'landing') {
      return (
        <PageTransition key="landing-page">
          <LandingPage />
        </PageTransition>
      );
    }
    return (
      <PageTransition key="auth-page">
        <AuthShowcase />
      </PageTransition>
    );
  }

  // Render the authenticated application layout components
  const renderActiveTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <ShowcaseDashboard />;
      case 'projects':
        return <FormShowcase />;
      case 'billing':
        return <BillingShowcase />;
      case 'settings':
        return <SettingsShowcase />;
      default:
        return <ShowcaseDashboard />;
    }
  };

  return (
    <div id="saas-app-root" className="flex min-h-screen w-full bg-background font-sans text-foreground antialiased transition-colors pb-16 md:pb-0 select-none">
      {/* Main column layout shell */}
      <MainContent>
        <PageTransition key={currentTab}>
          {renderActiveTab()}
        </PageTransition>
      </MainContent>

      {/* Mobile Bottom Navigation Bar */}
      <nav id="mobile-bottom-nav" className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/90 backdrop-blur-md border-t border-border flex items-center justify-around px-2 z-40 shadow-lg">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-lg transition-colors cursor-pointer ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'scale-110 font-black' : ''} transition-transform duration-150`} />
              <span className="text-[9px] font-black uppercase tracking-wider mt-1">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
