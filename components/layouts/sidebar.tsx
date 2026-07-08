'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@/providers/theme-provider';
import { APP_NAV_ITEMS } from '@/config/navigation';
import { 
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Moon,
  X
} from 'lucide-react';

export function Sidebar() {
  const { 
    isOpen, 
    toggleSidebar, 
    user, 
    currentTab, 
    setCurrentTab, 
    isCollapsed, 
    toggleCollapse 
  } = useAppStore();

  const { theme, setTheme } = useTheme();
  const [isProCardVisible, setIsProCardVisible] = React.useState(true);

  const sidebarContent = (
    <div className={cn(
      "flex h-full flex-col border-r border-border bg-card text-card-foreground select-none transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Branding Header Area */}
      <div className={cn(
        "flex h-16 items-center border-b border-border/85 bg-muted/10 transition-all",
        isCollapsed ? "px-4 justify-center" : "px-6 justify-between"
      )}>
        <div onClick={() => setCurrentTab('dashboard')} className="flex items-center gap-2.5 cursor-pointer">
          {/* Custom Stylized Logo inspired by Metallic glowing S in image */}
          <div className="shrink-0">
            <svg className="h-7 w-7 filter drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#db2777" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#0084ff" />
                </linearGradient>
              </defs>
              <path 
                d="M24 8H11C9.34315 8 8 9.34315 8 11V13.5C8 14.8807 9.11929 16 10.5 16H21.5C22.8807 16 24 17.1193 24 18.5V21C24 22.6569 22.6569 24 21 24H8" 
                stroke="url(#logoGrad)" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M14 12H18" 
                stroke="url(#logoGrad)" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
              />
              <path 
                d="M14 20H18" 
                stroke="url(#logoGrad)" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
              />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider text-foreground uppercase">SaaS Starter</span>
              <span className="text-[9px] text-[#0084ff] font-black uppercase tracking-widest leading-none mt-0.5">ESTRUTURA ATIVA</span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            type="button"
            onClick={toggleCollapse}
            className="h-7 w-7 rounded-lg border border-border/40 bg-background hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            aria-label="Recolher sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav className={cn(
        "flex-grow space-y-1 py-4 overflow-y-auto scrollbar-none",
        isCollapsed ? "px-2" : "px-3"
      )}>
        {!isCollapsed && (
          <p className="px-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">
            Painel Operacional
          </p>
        )}
        {isCollapsed && (
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={toggleCollapse}
              className="h-7 w-7 rounded-lg border border-border/40 bg-background hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              aria-label="Expandir sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        <ul className="space-y-1.5 list-none p-0 m-0">
        {APP_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <li key={item.id} className="m-0 p-0">
                <button
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => {
                    setCurrentTab(item.id);
                    // Close mobile drawer after selecting
                    if (window.innerWidth < 768) {
                      toggleSidebar();
                    }
                  }}
                  className={cn(
                    'group flex w-full items-center rounded-xl py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer text-left',
                    isCollapsed ? 'justify-center p-2' : 'px-3 gap-3 justify-start',
                    isActive
                      ? 'bg-neutral-200/50 dark:bg-neutral-800/60 dark:border dark:border-border/60 text-foreground font-semibold shadow-inner'
                      : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                  )}
                  aria-label={isCollapsed ? item.ariaLabel : undefined}
                >
                  <Icon className={cn('h-4 w-4 shrink-0 transition-transform group-hover:scale-105', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Middle Block: Help & Dark Mode Switch (Aesthetic likeness from image) */}
      {!isCollapsed && (
        <div className="px-5 py-3 border-t border-border/30 space-y-3 bg-[#1c1e26]/5 dark:bg-card/25">
          <div className="flex items-center justify-between text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <HelpCircle size={14} className="text-muted-foreground" />
              <span className="font-semibold uppercase text-[9px] tracking-wider">Ajuda e informações</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-2">
              <Moon size={14} className="text-muted-foreground" />
              <span className="font-semibold uppercase text-[9px] tracking-wider text-muted-foreground">Modo escuro</span>
            </div>
            {/* iOS-like Switch Active Slider */}
            <button
               onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Alternar modo escuro"
              aria-pressed={theme === 'dark'}
              className={cn(
                "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer outline-none relative",
                theme === 'dark' ? "bg-primary" : "bg-neutral-300 dark:bg-neutral-700"
              )}
            >
              <div
                className={cn(
                  "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200",
                  theme === 'dark' ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>
      )}

      {/* High Fidelity Upgrade to Pro Promo Card from image */}
      {isProCardVisible && !isCollapsed && (
        <div className="mx-3.5 my-3 p-4 rounded-2xl bg-white dark:bg-white text-black shadow-lg relative overflow-hidden group border border-neutral-100 flex flex-col">
          {/* Subtle colored background blurs */}
          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all pointer-events-none" />
          <div className="absolute -left-6 -top-6 w-16 h-16 bg-pink-500/20 rounded-full blur-xl pointer-events-none" />
          
          <button 
            type="button"
            onClick={() => setIsProCardVisible(false)}
            className="absolute top-2.5 right-2.5 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer z-10"
            aria-label="Ignorar"
          >
            <X size={13} />
          </button>
          
          <div className="self-start inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-purple-600 text-white text-[8px] font-black uppercase tracking-wider mb-2">
            Pro
          </div>
          
          <div className="text-2xl font-black tracking-tight text-neutral-900">$10/mês</div>
          <div className="text-[9px] text-neutral-500 font-extrabold leading-tight mt-0.5">cobrado anualmente • Todos os recursos</div>
          
          <button 
            type="button"
            onClick={() => {
              setCurrentTab('settings');
            }}
            className="w-full mt-3 py-1.5 px-3 rounded-lg bg-neutral-950 hover:bg-neutral-900 text-white text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer text-center"
          >
            Fazer upgrade
          </button>
        </div>
      )}

      {/* User Profile Preview Stack Footer */}
      <div className={cn(
        "p-4 border-t border-border/60 transition-all",
        isCollapsed && "p-2 text-center"
      )}>
        {user ? (
          <div 
            onClick={() => setCurrentTab('settings')}
            className={cn(
              "flex items-center gap-3 rounded-lg bg-primary/5 border border-primary/15 transition-all cursor-pointer hover:bg-primary/10 select-none",
              isCollapsed ? "flex-col justify-center p-2 gap-1.5" : "p-3.5 flex-row text-left"
            )}
            role="button"
            tabIndex={0}
            aria-label="Ver perfil e conta"
          >
            {/* High Fidelity Circle Avatar */}
            <div className="h-8 w-8 rounded-full border border-primary/25 bg-primary/10 flex items-center justify-center font-bold text-[10px] uppercase text-primary shrink-0 relative">
              <span className="relative z-10">{user.name.slice(0, 2)}</span>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card" />
            </div>

            {!isCollapsed ? (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black text-foreground truncate">{user.name}</div>
                <div className="text-[9px] text-muted-foreground truncate font-semibold leading-none mt-0.5">{user.email}</div>
                <div className="inline-flex items-center mt-1.5 px-1.5 py-0.5 rounded-full bg-primary/10 text-[8px] text-primary font-black uppercase tracking-widest leading-none">
                  {user.role}
                </div>
              </div>
            ) : (
              <span className="text-[7px] text-primary font-black uppercase tracking-wider leading-none">
                {user.role.split(' ')[0]}
              </span>
            )}
          </div>
        ) : (
          <div 
            onClick={() => setCurrentTab('settings')}
            className={cn(
              "rounded-lg bg-rose-500/5 p-3 text-center border border-rose-500/15 cursor-pointer hover:bg-rose-500/10 transition-colors select-none",
              isCollapsed ? "p-1.5" : "p-3"
            )}
          >
            {!isCollapsed ? (
              <>
                <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Sem Sessão</div>
                <p className="text-[9px] text-muted-foreground leading-none mt-1 font-semibold">Clique para entrar</p>
              </>
            ) : (
              <div className="h-8 w-8 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 font-bold text-xs" aria-label="Não autenticado">
                ?
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex h-screen sticky top-0 shrink-0 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen ? (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs"
            />

            {/* Sliding drawer */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
              className="relative flex h-full z-10"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
