'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useTheme } from '@/providers/theme-provider';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  FolderKanban,
  Key,
  Layers,
  Bell,
  Search,
  HelpCircle,
  Moon,
  Sun,
  LogOut,
  BellRing,
  CheckCircle,
  AlertCircle,
  CreditCard
} from 'lucide-react';

export function Header() {
  const {
    currentTab,
    setCurrentTab,
    notifications,
    clearNotifications,
    user,
    logout,
    isMobileNotificationsOpen,
    setMobileNotificationsOpen
  } = useAppStore();

  const { theme, setTheme } = useTheme();

  // Navigation items matching the requested order: Painel, Projetos, Assinatura, Configurações
  const navTabs = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'projects', label: 'Projetos', icon: FolderKanban },
    { id: 'billing', label: 'Assinatura', icon: CreditCard },
    { id: 'settings', label: 'Configurações', icon: Key },
  ] as const;

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Some beautiful fallback system notifications if there are no active warnings
  const fallbackNotifications = [
    {
      id: 'mock-1',
      message: 'Módulo Sentinel Guard ativado com êxito no ambiente.',
      type: 'success' as const,
      time: 'Há 5m'
    },
    {
      id: 'mock-2',
      message: 'Cluster Docker Hub sincronizado recentemente.',
      type: 'info' as const,
      time: 'Há 12m'
    },
    {
      id: 'mock-3',
      message: 'Novo orçamento alocado para Projeto Ômega Cluster.',
      type: 'success' as const,
      time: 'Há 2h'
    }
  ];

  const activeAlerts = notifications.length > 0 
    ? notifications.map(n => ({ id: n.id, message: n.message, type: n.type, time: 'Agora' }))
    : fallbackNotifications;

  const handleClearNotifications = () => {
    clearNotifications();
    setIsNotificationsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md transition-all select-none">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 gap-4">
        
        {/* Left Section: Logo */}
        <div className="flex items-center gap-4 flex-1 justify-start">
          {/* Custom Glowing Gradient Logo as Branded Face of the App */}
          <div 
            onClick={() => setCurrentTab('dashboard')} 
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity shrink-0"
          >
            <div className="shrink-0">
              <svg className="h-7 w-7 filter drop-shadow-[0_0_8px_rgba(0,132,255,0.3)]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="navLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#db2777" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#0084ff" />
                  </linearGradient>
                </defs>
                <path 
                  d="M24 8H11C9.34315 8 8 9.34315 8 11V13.5C8 14.8807 9.11929 16 10.5 16H21.5C22.8807 16 24 17.1193 24 18.5V21C24 22.6569 22.6569 24 21 24H8" 
                  stroke="url(#navLogoGrad)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M14 12H18" 
                  stroke="url(#navLogoGrad)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M14 20H18" 
                  stroke="url(#navLogoGrad)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider text-foreground uppercase leading-none">SaaS Starter</span>
              <span className="text-[8px] text-[#0084ff] font-extrabold uppercase tracking-wider leading-none mt-0.5">ESTRUTURA ATIVA</span>
            </div>
          </div>
        </div>

        {/* Middle Section: Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center justify-center gap-1 shrink-0">
          {navTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={cn(
                  "relative px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-lg flex items-center gap-2",
                  isActive
                    ? "text-primary font-extrabold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                <TabIcon className={cn("h-3.5 w-3.5", isActive ? "text-primary" : "text-muted-foreground")} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navTabHighlight"
                    className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Interactive Dropdowns & Search */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          {/* Quick Search on Desktop */}
          <div className="hidden sm:flex items-center gap-2 relative w-48 lg:w-60">
            <Search className="h-3.5 w-3.5 absolute left-3 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar recursos..."
              className="w-full text-xs bg-muted/60 text-foreground border border-border/75 rounded-lg py-1.5 pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/75"
            />
          </div>

          <div className="h-6 w-[1px] bg-border/80 hidden sm:block" />

          {/* Notifications Trigger Container */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  setMobileNotificationsOpen(!isMobileNotificationsOpen);
                } else {
                  setIsNotificationsOpen(!isNotificationsOpen);
                }
              }}
              className={cn(
                "h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer relative",
                (isNotificationsOpen || isMobileNotificationsOpen) && "bg-muted text-foreground"
              )}
              aria-label="Notificações"
            >
              <Bell className="h-4.5 w-4.5" />
              {activeAlerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
              )}
            </button>

            {/* Notifications Menu - Only on Desktop */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <div className="hidden md:block">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-card shadow-xl p-3.5 origin-top-right z-50 text-left"
                  >
                    <div className="flex items-center justify-between pb-2.5 border-b border-border mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <BellRing className="h-4 w-4 text-primary" />
                        <span className="text-xs font-black uppercase tracking-wider text-foreground">Alertas Ativos</span>
                      </div>
                      <button
                        onClick={handleClearNotifications}
                        className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider cursor-pointer"
                      >
                        Limpar Tudo
                      </button>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-none">
                      {activeAlerts.map((alert) => (
                        <div key={alert.id} className="flex gap-2.5 p-2 rounded-lg bg-muted/30 border border-border/40 text-left">
                          <div className="shrink-0 mt-0.5">
                            {alert.type === 'success' ? (
                              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <AlertCircle className="h-3.5 w-3.5 text-blue-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold leading-normal text-foreground">{alert.message}</p>
                            <span className="text-[9px] text-muted-foreground/75 mt-0.5 block">{alert.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Thumbnail Trigger Container */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 border border-border/80 rounded-full p-0.5 hover:bg-muted/40 transition-all cursor-pointer relative"
              aria-label="Menu do Usuário"
            >
              {/* Profile Image Miniature Wrapper */}
              <div className="relative h-8 w-8 rounded-full border border-primary/25 bg-primary/10 flex items-center justify-center font-black text-xs uppercase text-primary shrink-0 transition-transform duration-200 active:scale-95 shadow-sm overflow-hidden">
                <span className="relative z-10">{user ? user.name.slice(0, 2) : 'LU'}</span>
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-card" />
              </div>
            </button>

            {/* Stylized & Animated Profile Options Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-card shadow-2xl p-4 origin-top-right z-50 text-left"
                >
                  {/* Account Summary */}
                  <div className="flex flex-col pb-3.5 border-b border-border/70 mb-3 ml-1 select-none">
                    <span className="text-xs font-black text-foreground truncate">
                      {user ? user.name : 'Luis Tavares'}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate font-semibold leading-none mt-1">
                      {user ? user.email : 'luistavares235@gmail.com'}
                    </span>
                    <div className="self-start mt-2 px-2 py-0.5 rounded-full bg-primary/10 text-[8px] text-primary font-black uppercase tracking-widest leading-none">
                      {user ? user.role : 'Developer'}
                    </div>
                  </div>

                  {/* Dropdown Options */}
                  <div className="space-y-1">
                    {/* Navigation shortcuts inside dropdown */}
                    <button
                      onClick={() => {
                        setCurrentTab('dashboard');
                        setIsProfileOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all text-left cursor-pointer",
                        currentTab === 'dashboard' && "text-primary bg-primary/5"
                      )}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Painel</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('projects');
                        setIsProfileOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all text-left cursor-pointer",
                        currentTab === 'projects' && "text-primary bg-primary/5"
                      )}
                    >
                      <FolderKanban className="h-4 w-4" />
                      <span>Projetos</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('billing');
                        setIsProfileOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all text-left cursor-pointer",
                        currentTab === 'billing' && "text-primary bg-primary/5"
                      )}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Assinatura</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('settings');
                        setIsProfileOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all text-left cursor-pointer",
                        currentTab === 'settings' && "text-primary bg-primary/5"
                      )}
                    >
                      <Key className="h-4 w-4" />
                      <span>Configurações</span>
                    </button>

                    <div className="h-[1px] bg-border/70 my-2" />

                    {/* Highly Styled Dark Mode Toggle iOS Switch Button */}
                    <div className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-muted/20 select-none">
                      <div className="flex items-center gap-2.5">
                        {theme === 'dark' ? (
                          <Moon className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Sun className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Dark Mode</span>
                      </div>
                      <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={cn(
                          "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer outline-none relative",
                          theme === 'dark' ? "bg-primary" : "bg-neutral-300 dark:bg-neutral-700"
                        )}
                        aria-label="Alternar Modo Escuro"
                      >
                        <div
                          className={cn(
                            "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200",
                            theme === 'dark' ? "translate-x-4" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>

                    <a
                      href="#help"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentTab('settings');
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all text-left"
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span>Ajuda & Info</span>
                    </a>

                    <div className="h-[1px] bg-border/70 my-2" />

                    {/* Logout Option */}
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider text-red-500 hover:text-red-600 hover:bg-red-500/5 transition-all text-left cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Encerrar Sessão</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
