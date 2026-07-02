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
    <div className="flex-1 flex flex-col min-h-screen bg-background relative overflow-x-clip">
      <Header />

      {/* Primary viewport content slot */}
      <main id="primary-main-content" className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 min-w-0 overflow-x-hidden md:overflow-x-visible">
        {children}
      </main>

      {/* Footer Area */}
      <footer className="w-full border-t border-border/60 py-4 px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between mt-auto bg-card/20 select-none text-[10px] text-muted-foreground font-semibold uppercase tracking-widest gap-2">
        <div>Construído com Princípios SOLID & DRY</div>
        <div className="flex gap-4">
          <span>ESLint</span>
          <span>Prettier</span>
          <span>Husky</span>
          <span>Vitest</span>
        </div>
      </footer>

      {/* Notification Toast System overlay */}
      <div className="fixed bottom-20 left-4 right-4 md:bottom-6 md:right-6 md:left-auto md:max-w-sm z-50 flex flex-col gap-2.5 pointer-events-none">
        <AnimatePresence>
          {notifications.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              layout
              className="glass-effect rounded-lg p-3.5 border border-border/80 shadow-md flex gap-3 items-start pointer-events-auto select-none"
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
                className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0 transition-colors p-0.5"
                aria-label="Delete Notification"
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
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 bg-card border-t border-border rounded-t-3xl shadow-2xl p-6 z-[100] pb-10 flex flex-col max-h-[85vh] pointer-events-auto text-left"
            >
              {/* Drag Handle Indicator */}
              <div className="mx-auto w-12 h-1.5 rounded-full bg-border/80 mb-5 shrink-0" />

              {/* Header Title */}
              <div className="flex items-center justify-between pb-3.5 border-b border-border mb-4 select-none shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-[#0084ff]">Avisos Operacionais</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileNotificationsOpen(false)}
                  className="p-1 px-2.5 rounded-lg bg-muted text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
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
                  className="flex-1 py-3 px-4 bg-[#db2777]/10 hover:bg-[#db2777]/15 border border-[#db2777]/25 text-[#db2777] font-black uppercase text-[10px] tracking-widest rounded-xl transition-all cursor-pointer text-center"
                >
                  Limpar Alertas
                </button>
                <button
                  type="button"
                  onClick={() => setMobileNotificationsOpen(false)}
                  className="flex-1 py-3 px-4 bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest rounded-xl shadow-md cursor-pointer text-center"
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
