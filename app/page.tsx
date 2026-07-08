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
import { APP_NAV_ITEMS, type AppTab } from '@/config/navigation';

export default function Home() {
  const { user, authView, currentTab, setCurrentTab } = useAppStore();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [authView, currentTab, user]);

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
  const renderActiveTab = (tab: AppTab) => {
    switch (tab) {
      case 'dashboard':
        return <ShowcaseDashboard />;
      case 'projects':
        return <FormShowcase />;
      case 'billing':
        return <BillingShowcase />;
      case 'settings':
        return <SettingsShowcase />;
    }
  };

  return (
    <div
      id="saas-app-root"
      className="flex min-h-screen w-full bg-background pb-[calc(4rem+env(safe-area-inset-bottom))] font-sans text-foreground antialiased transition-colors md:pb-0"
    >
      {/* Main column layout shell */}
      <MainContent>
        <PageTransition key={currentTab}>
          {renderActiveTab(currentTab)}
        </PageTransition>
      </MainContent>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-nav"
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-40 flex h-[calc(4rem+env(safe-area-inset-bottom))] items-center justify-around border-t border-border bg-card/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur-md md:hidden"
      >
        {APP_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => setCurrentTab(item.id)}
              className={`flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center rounded-lg px-1 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon
                className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform duration-150 motion-reduce:transition-none`}
                aria-hidden="true"
              />
              <span className="mt-1 max-w-full truncate text-[10px] font-black uppercase tracking-wider">
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
