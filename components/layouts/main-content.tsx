'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Header } from './header';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const {
    notifications,
    removeNotification,
    isMobileNotificationsOpen,
    setMobileNotificationsOpen,
    clearNotifications
  } = useAppStore();

  const iconMap = {
    success: <CheckCircle className="h-4 w-4 text-green-500" />,
    info: <Info className="h-4 w-4 text-blue-500" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    error: <AlertCircle className="h-4 w-4 text-red-500" />,
  };

  return (
    <div className="relative flex min-h-screen min-w-0 flex-1 flex-col overflow-x-clip bg-background">
      <Header />

      {/* Primary viewport content slot */}
      <main
        id="primary-main-content"
        className="mx-auto flex w-full max-w-7xl min-w-0 flex-1 flex-col gap-6 overflow-x-hidden px-4 py-4 sm:px-6 sm:py-6 md:overflow-x-visible md:px-8 md:py-8"
      >
        {children}
      </main>

      {/* Footer Area */}
      <footer className="mt-auto flex w-full flex-col items-center justify-between gap-2 border-t border-border/60 bg-card/20 px-4 py-4 text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:flex-row md:px-8">
        <div className="break-anywhere">Construído com Princípios SOLID & DRY</div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <span>ESLint</span>
          <span>TypeScript</span>
          <span>Vitest</span>
          <span>Playwright</span>
        </div>
      </footer>

      {/* Notification Toast System overlay */}
      <div className="pointer-events-none fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-4 right-4 z-50 flex flex-col gap-2.5 md:bottom-6 md:left-auto md:right-6 md:max-w-sm">
        <AnimatePresence>
          {notifications.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              layout
                className="glass-effect pointer-events-auto flex items-start gap-3 rounded-lg border border-border/80 p-3.5 shadow-md"
            >
              <div className="pt-0.5 shrink-0">
                {iconMap[toast.type]}
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-semibold text-foreground leading-snug">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeNotification(toast.id)}
                className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Remover notificação"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Mobile Notifications Overlay */}
      <AnimatePresence>
        {isMobileNotificationsOpen && (
          <div className="md:hidden">
            {/* Dark Blur Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNotificationsOpen(false)}
              className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm z-[90] pointer-events-auto"
            />

            {/* Sliding Drawer element */}
            <motion.div
              id="mobile-notifications-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-notifications-title"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="pointer-events-auto fixed inset-x-0 bottom-0 z-[100] flex max-h-[85vh] flex-col rounded-t-3xl border-t border-border bg-card p-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] text-left shadow-2xl"
            >
              {/* Drag Handle Indicator */}
              <div className="mx-auto w-12 h-1.5 rounded-full bg-border/80 mb-5 shrink-0" />

              {/* Header Title */}
              <div className="flex items-center justify-between pb-3.5 border-b border-border mb-4 select-none shrink-0">
                <div className="flex items-center gap-2">
                  <span id="mobile-notifications-title" className="text-xs font-black uppercase tracking-widest text-[#0084ff]">Avisos Operacionais</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileNotificationsOpen(false)}
                  aria-label="Fechar avisos operacionais"
                  className="rounded-lg bg-muted px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Fechar
                </button>
              </div>

              {/* Alerts Scrollable Content Area */}
              <div className="space-y-3 overflow-y-auto flex-1 pr-1 pb-4">
                {(notifications.length > 0 ? notifications : [
                  { id: 'm1', message: 'Módulo Sentinel Guard ativado com êxito no ambiente.', type: 'success' as const },
                  { id: 'm2', message: 'Cluster Docker Hub sincronizado recentemente.', type: 'info' as const },
                  { id: 'm3', message: 'Novo orçamento alocado para Projeto Ômega Cluster.', type: 'success' as const }
                ]).map((alert) => (
                  <div key={alert.id} className="p-3.5 rounded-xl bg-muted/40 border border-border/40 flex gap-3.5 items-start text-left">
                    <div className="shrink-0 pt-0.5">
                      {iconMap[alert.type] || <Info className="h-4 w-4 text-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground leading-relaxed">
                        {alert.message}
                      </p>
                      <span className="text-[9px] text-muted-foreground/75 mt-1 block uppercase font-bold tracking-wider">Módulo Sistema</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action actions inside the mobile drawer */}
              <div className="flex gap-3 pt-4 border-t border-border shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    clearNotifications();
                    setMobileNotificationsOpen(false);
                  }}
                  className="flex-1 rounded-xl border border-[#db2777]/25 bg-[#db2777]/10 px-4 py-3 text-center text-[10px] font-black uppercase tracking-widest text-[#db2777] transition-all hover:bg-[#db2777]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Limpar Alertas
                </button>
                <button
                  type="button"
                  onClick={() => setMobileNotificationsOpen(false)}
                  className="flex-1 rounded-xl bg-primary px-4 py-3 text-center text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Continuar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default MainContent;
