'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useAppStore, type ApiKey } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { ResponsiveDataView, type DataColumn } from '@/components/ui/responsive-data-view';
import { cn } from '@/lib/utils';
import { 
  Key, 
  Database, 
  User, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Cpu, 
  AlertTriangle, 
  Server,
  LogOut,
  Shield,
  Sun,
  Moon,
  Monitor,
  Layers,
  ChevronDown,
  type LucideIcon
} from 'lucide-react';
import { useTheme } from '@/providers/theme-provider';
import { ComponentsGuide } from '../components/components-guide';

const connectionSchema = z.object({
  apiEndpoint: z.string().url({ message: 'O endpoint da API REST deve ser uma URL válida (HTTP/HTTPS).' }),
  dbHost: z.string().min(2, { message: 'O host mock de banco deve possuir pelo menos 2 caracteres.' }),
  dbPort: z.coerce.number().min(1024).max(65535, { message: 'Portas TCP válidas estão entre 1024 e 65535.' }),
  dbUser: z.string().min(2, { message: 'Informe um usuário mock com pelo menos 2 caracteres.' }),
});

const profileSchema = z.object({
  name: z.string().min(2, { message: 'O nome de usuário deve conter pelo menos 2 letras.' }),
  email: z.string().email({ message: 'Insira um e-mail institucional válido.' }),
});

type ConnectionFormInput = z.input<typeof connectionSchema>;
type ConnectionFormData = z.output<typeof connectionSchema>;
type ProfileFormData = z.output<typeof profileSchema>;
type SettingsSubTab = 'profile' | 'appearance' | 'infrastructure' | 'design';

const settingsSections: Array<{
  id: SettingsSubTab;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    id: 'profile',
    label: 'Perfil & Segurança JWT',
    description: 'Sessão, token e operador',
    icon: Shield,
  },
  {
    id: 'appearance',
    label: 'Aparência do Painel',
    description: 'Tema claro, escuro ou sistema',
    icon: Sun,
  },
  {
    id: 'infrastructure',
    label: 'Conectores de API & Infra',
    description: 'Chaves e conectores simulados',
    icon: Server,
  },
  {
    id: 'design',
    label: 'Design System',
    description: 'Componentes base do starter',
    icon: Layers,
  },
];

const settingsSegmentItems: Array<{
  value: SettingsSubTab;
  label: string;
  ariaLabel: string;
  icon: LucideIcon;
}> = settingsSections.map((section) => ({
  value: section.id,
  label: section.label,
  ariaLabel: `Abrir ${section.label}`,
  icon: section.icon,
}));

const maskApiKey = (key: string) => `${key.substring(0, 14)}........${key.substring(key.length - 6)}`;

export function SettingsShowcase() {
  const shouldReduceMotion = useReducedMotion();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { 
    user, 
    logout, 
    updateProfile, 
    config, 
    updateConfig, 
    apiKeys, 
    generateApiKey, 
    revokeApiKey, 
    addNotification 
  } = useAppStore();

  const [activeSubTab, setActiveSubTab] = useState<SettingsSubTab>('profile');
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const activeSection = settingsSections.find((section) => section.id === activeSubTab) ?? settingsSections[0];
  const ActiveSectionIcon = activeSection.icon;

  // Hook form for infrastructure parameters
  const {
    register: regConnection,
    handleSubmit: handleConnectionSubmit,
    formState: { errors: connectionErrors },
  } = useForm<ConnectionFormInput, unknown, ConnectionFormData>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      apiEndpoint: config.apiEndpoint,
      dbHost: config.dbHost,
      dbPort: config.dbPort,
      dbUser: config.dbUser,
    },
  });

  // Hook form for user profile updates
  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSaveConnections = (data: ConnectionFormData) => {
    setSavingConfig(true);
    setTimeout(() => {
      updateConfig(data);
      addNotification('Variáveis de infraestrutura local aplicadas com sucesso!', 'success');
      setSavingConfig(false);
    }, Math.max(config.mockLatency, 400));
  };

  const onSaveProfile = (data: ProfileFormData) => {
    setSavingProfile(true);
    setTimeout(() => {
      updateProfile(data.name, data.email);
      addNotification('Perfil de usuário sincronizado com sucesso!', 'success');
      setSavingProfile(false);
    }, 400);
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      addNotification('Insira um nome válido para identificar a Chave de API.', 'warning');
      return;
    }
    generateApiKey(newKeyName.trim());
    addNotification(`Chave de API "${newKeyName}" gerada com sucesso!`, 'success');
    setNewKeyName('');
  };

  const handleCopyKey = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    addNotification('Chave token copiada para a área de transferência', 'success');
    setTimeout(() => setCopiedKeyId(null), 1500);
  };

  const handleCopyToken = () => {
    if (user?.token) {
      navigator.clipboard.writeText(`Bearer ${user.token}`);
      setCopiedToken(true);
      addNotification('Token JWT assinado copiado!', 'success');
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handleRevokeKey = (id: string, name: string) => {
    revokeApiKey(id);
    addNotification(`A Chave de API "${name}" foi revogada!`, 'warning');
  };

  const handleSectionChange = (nextSubTab: SettingsSubTab) => {
    setActiveSubTab(nextSubTab);
    setIsSectionMenuOpen(false);
  };

  const apiKeyColumns: Array<DataColumn<ApiKey>> = [
    {
      key: 'name',
      header: 'Chave',
      render: (key) => (
        <div className="min-w-0 space-y-1">
          <span className="break-anywhere text-xs font-black uppercase tracking-tight text-foreground">
            {key.name}
          </span>
          <span className="block text-[10px] font-semibold text-muted-foreground">
            Criada para validação visual do starter kit
          </span>
        </div>
      ),
    },
    {
      key: 'token',
      header: 'Token',
      render: (key) => (
        <code className="break-all rounded border border-border/60 bg-background px-2 py-1 font-mono text-[10px] font-bold text-muted-foreground select-all">
          {maskApiKey(key.key)}
        </code>
      ),
    },
    {
      key: 'usage',
      header: 'Uso',
      align: 'right',
      render: (key) => (
        <span className="text-[10px] font-bold text-muted-foreground">
          {key.lastUsed !== 'Nunca' ? 'Há 5m' : 'Nunca'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      align: 'right',
      render: (key) => (
        <div className="flex justify-end gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleCopyKey(key.id, key.key)}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            aria-label={`Copiar chave ${key.name} na tabela`}
          >
            {copiedKeyId === key.id ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            id={`btn-revoke-key-${key.id}-table`}
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRevokeKey(key.id, key.name)}
            aria-label={`Revogar chave ${key.name} na tabela`}
            className="h-9 w-9 text-muted-foreground hover:bg-rose-500/15 hover:text-rose-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const renderApiKeyMobileCard = (key: ApiKey) => (
    <article className="min-w-0 rounded-lg border border-border bg-muted/20 p-3">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="break-anywhere text-xs font-black uppercase tracking-tight text-foreground">
            {key.name}
          </h3>
          <code className="block break-all rounded border border-border/60 bg-background px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground select-all">
            {maskApiKey(key.key)}
          </code>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleCopyKey(key.id, key.key)}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            aria-label={`Copiar chave ${key.name} no card móvel`}
          >
            {copiedKeyId === key.id ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            id={`btn-revoke-key-${key.id}-card`}
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRevokeKey(key.id, key.name)}
            aria-label={`Revogar chave ${key.name} no card móvel`}
            className="h-9 w-9 text-muted-foreground hover:bg-rose-500/15 hover:text-rose-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="mt-3 border-t border-border/40 pt-2 text-[10px] font-bold text-muted-foreground">
        Uso: {key.lastUsed !== 'Nunca' ? 'Há 5m' : 'Nunca'}
      </p>
    </article>
  );

  return (
    <div id="settings-showcase-container" className="space-y-6 text-left">
      <PageHeader
        id="settings-page-header"
        eyebrow="Preferências"
        title="Configurações Integradas"
        description="Gerencie seu perfil operativo, controle chaves demonstrativas de API e administre conectores locais simulados."
        icon={Key}
      />

      {/* Internal Settings Subtab Navigator */}
      <div
        className="relative md:hidden"
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setIsSectionMenuOpen(false);
          }
        }}
      >
        <button
          type="button"
          aria-label={`Selecionar seção de configurações. Atual: ${activeSection.label}`}
          aria-haspopup="listbox"
          aria-controls="settings-mobile-section-listbox"
          aria-expanded={isSectionMenuOpen}
          onClick={() => setIsSectionMenuOpen((isOpen) => !isOpen)}
          className="glass-effect flex min-h-14 w-full items-center gap-3 rounded-xl border border-border/80 bg-card/80 px-3.5 py-3 text-left shadow-sm transition-all hover:border-primary/40 hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <ActiveSectionIcon className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-black uppercase tracking-wider text-foreground">
              {activeSection.label}
            </span>
            <span className="mt-0.5 block truncate text-[10px] font-semibold text-muted-foreground">
              {activeSection.description}
            </span>
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
              isSectionMenuOpen && 'rotate-180 text-primary'
            )}
            aria-hidden="true"
          />
        </button>

        <AnimatePresence>
          {isSectionMenuOpen && (
            <motion.div
              id="settings-mobile-section-listbox"
              role="listbox"
              aria-label="Seções de configurações"
              initial={shouldReduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 top-full z-30 mt-2 rounded-xl border border-border/80 bg-card/95 p-2 shadow-xl backdrop-blur-md"
            >
              {settingsSections.map((section) => {
                const SectionIcon = section.icon;
                const isActive = activeSubTab === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSectionChange(section.id)}
                    className={cn(
                      'flex min-h-12 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all cursor-pointer',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors',
                        isActive ? 'border-primary/30 bg-primary/10' : 'border-border/70 bg-muted/20'
                      )}
                    >
                      <SectionIcon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-black uppercase tracking-wider leading-tight">
                        {section.label}
                      </span>
                      <span className="mt-0.5 block text-[10px] font-semibold leading-tight text-muted-foreground">
                        {section.description}
                      </span>
                    </span>
                    {isActive && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="hidden md:block">
        <SegmentedControl
          items={settingsSegmentItems}
          value={activeSubTab}
          onValueChange={handleSectionChange}
          ariaLabel="Seções de configurações"
          size="sm"
          className="w-full justify-start bg-card/50"
        />
      </div>

      {activeSubTab === 'profile' ? (
        /* USER PROFILE & SESSION AUDITOR PAGE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main User Profile Card Form */}
          <form 
            onSubmit={handleProfileSubmit(onSaveProfile)}
            className="lg:col-span-7 bg-card border border-border rounded-xl overflow-hidden shadow-xs"
          >
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4.5 w-4.5 text-primary" />
                DADOS DO OPERADOR
              </CardTitle>
              <CardDescription>
                Atualize suas credenciais visuais utilizadas no barramento de projetos e logs ativos do Zustand.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Input
                    label="Nome no Perfil"
                    placeholder="Luis Tavares"
                    error={profileErrors.name?.message}
                    {...regProfile('name')}
                  />
                </div>

                <div className="space-y-1">
                  <Input
                    label="E-mail Corporativo"
                    placeholder="ex@empresa.com"
                    error={profileErrors.email?.message}
                    {...regProfile('email')}
                  />
                </div>
              </div>

              {user && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 border border-border/80 rounded-xl p-4 text-xs mt-2">
                  <div>
                    <span className="text-muted-foreground block font-semibold">Nível de Acesso</span>
                    <span className="font-black text-foreground uppercase tracking-wider text-[10px] bg-primary/10 px-2 py-0.5 rounded text-primary mt-1.5 inline-block">
                      {user.role}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Token de Sessão</span>
                    <span className="font-mono text-[9px] text-muted-foreground block mt-1.5 break-all">
                      {user.token}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t border-border/40 bg-muted/10 px-6 py-4 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="break-anywhere text-[10px] text-muted-foreground leading-snug">
                Mudanças aplicam-se instantaneamente na sidebar e fluxo de logs.
              </p>
              <Button
                id="btn-profile-save"
                type="submit"
                className="w-full px-4 shrink-0 font-bold text-xs sm:w-auto"
                isLoading={savingProfile}
              >
                Atualizar Perfil
              </Button>
            </CardFooter>
          </form>

          {/* Cryptographic JWT auditor (Right Column) */}
          <div className="lg:col-span-5 space-y-6">
            <Card id="session-security-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4.5 w-4.5 text-primary" />
                  Assinatura de Sessão JWT
                </CardTitle>
                <CardDescription>
                  Inspecione o token Bearer demonstrativo da sessão mockada.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-semibold">Algoritmo</span>
                    <span className="font-mono text-foreground font-bold">HS256 (HMAC-SHA256)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-border/40 pt-2.5">
                    <span className="text-muted-foreground font-semibold">Status de Assinatura</span>
                    <span className="text-green-500 font-extrabold flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                      <span className="h-2 w-2 rounded-full bg-green-500 inline-block animate-pulse" /> Ativo
                    </span>
                  </div>
                </div>

                {user && (
                  <div className="space-y-2.5 bg-muted/40 border border-border/80 rounded-xl p-3.5 relative overflow-hidden font-mono text-[9px] leading-relaxed text-muted-foreground text-left whitespace-pre-wrap break-all select-all">
                    Bearer {user.token}
                  </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    id="btn-copy-jwt"
                    variant="outline"
                    onClick={handleCopyToken}
                    className="flex-1 text-xs font-black uppercase tracking-wider gap-1.5 cursor-pointer"
                  >
                    {copiedToken ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    Copiar Token Bearer
                  </Button>
                  
                  <Button
                    id="btn-perform-logout"
                    variant="ghost"
                    onClick={logout}
                    className="font-black text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 uppercase tracking-wider cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-1.5" /> Sair
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      ) : activeSubTab === 'appearance' ? (
        /* THEME & APPEARANCE CONFIGURATION */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <Card id="theme-appearance-card" className="lg:col-span-8 bg-card border border-border rounded-xl shadow-xs overflow-hidden">
            <CardHeader className="text-left">
              <CardTitle className="text-base flex items-center gap-2">
                <Sun className="h-4.5 w-4.5 text-primary" />
                Tema do Sistema & Aparência
              </CardTitle>
              <CardDescription>
                Selecione a paleta visual desejada para a interface do dashboard. O sistema se adapta instantaneamente e de forma persistente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Light Theme Button */}
                <button
                  type="button"
                  aria-pressed={theme === 'light'}
                  onClick={() => {
                    setTheme('light');
                    addNotification('Tema alterado para Modo Claro!', 'success');
                  }}
                  className={`flex flex-col items-center justify-center p-5 rounded-xl border transition-all cursor-pointer text-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    theme === 'light'
                      ? 'border-primary bg-primary/5 text-primary scale-[1.02]'
                      : 'border-border/60 hover:border-border hover:bg-muted/30 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Sun className={`h-6 w-6 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="space-y-0.5">
                    <span className="text-xs font-black uppercase tracking-wider block">Claro</span>
                    <span className="text-[10px] text-muted-foreground block font-semibold leading-none">Para ambientes iluminados</span>
                  </div>
                </button>

                {/* Dark Theme Button */}
                <button
                  type="button"
                  aria-pressed={theme === 'dark'}
                  onClick={() => {
                    setTheme('dark');
                    addNotification('Tema alterado para Modo Escuro!', 'success');
                  }}
                  className={`flex flex-col items-center justify-center p-5 rounded-xl border transition-all cursor-pointer text-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    theme === 'dark'
                      ? 'border-primary bg-primary/5 text-primary scale-[1.02]'
                      : 'border-border/60 hover:border-border hover:bg-muted/30 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Moon className={`h-6 w-6 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="space-y-0.5">
                    <span className="text-xs font-black uppercase tracking-wider block">Escuro</span>
                    <span className="text-[10px] text-muted-foreground block font-semibold leading-none">Minimiza fadiga ocular</span>
                  </div>
                </button>

                {/* System Theme Button */}
                <button
                  type="button"
                  aria-pressed={theme === 'system'}
                  onClick={() => {
                    setTheme('system');
                    addNotification('Tema ajustado para seguir as preferências do Sistema!', 'success');
                  }}
                  className={`flex flex-col items-center justify-center p-5 rounded-xl border transition-all cursor-pointer text-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    theme === 'system'
                      ? 'border-primary bg-primary/5 text-primary scale-[1.02]'
                      : 'border-border/60 hover:border-border hover:bg-muted/30 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Monitor className={`h-6 w-6 ${theme === 'system' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="space-y-0.5">
                    <span className="text-xs font-black uppercase tracking-wider block">Sistema</span>
                    <span className="text-[10px] text-muted-foreground block font-semibold leading-none">Sincroniza com as preferências do OS</span>
                  </div>
                </button>
              </div>

              <div className="bg-muted/20 border border-border/80 rounded-xl p-4 text-xs font-semibold text-left">
                <span className="text-muted-foreground block font-semibold">Status do Resolvedor de Temas</span>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="break-anywhere text-[10px] font-black uppercase tracking-wider text-foreground">
                    Modo {resolvedTheme === 'dark' ? 'Escuro' : 'Claro'} Configurado Ativamente (Classes DOM Sincronizadas)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : activeSubTab === 'infrastructure' ? (
        /* INFRASTRUCTURE & CONNECTORS PAGE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Active API Keys list and simulator */}
          <div className="lg:col-span-7 space-y-6">
            <Card id="api-keys-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="h-4.5 w-4.5 text-primary" />
                  Chaves de API Ativas
                </CardTitle>
                <CardDescription>
                  Use essas chaves apenas como valores demonstrativos para validar a interface do starter kit.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Generate Key Input */}
                <form onSubmit={handleGenerateKey} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                  <Input
                    label="Nome da chave de API"
                    type="text"
                    required
                    placeholder="Nome do Token (Ex: Staging Gateway)"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="font-semibold"
                  />
                  <Button id="btn-generate-key" type="submit" size="sm" className="w-full gap-2 shrink-0 cursor-pointer text-xs font-bold sm:w-auto">
                    <Plus className="h-3.5 w-3.5" /> Gerar Chave
                  </Button>
                </form>

                {/* Keys Lists */}
                <ResponsiveDataView
                  rows={apiKeys}
                  columns={apiKeyColumns}
                  getRowKey={(key) => key.id}
                  ariaLabel="Chaves de API ativas"
                  emptyState={{
                    icon: <Key className="h-10 w-10 text-muted-foreground stroke-1" />,
                    title: 'Nenhuma chave cadastrada atualmente',
                    description: 'Gere uma chave demonstrativa para validar estados de lista, cópia e revogação.',
                    className: 'max-w-none py-6',
                  }}
                  renderMobileCard={renderApiKeyMobileCard}
                  className="pt-2"
                  tableClassName="min-w-[42rem]"
                />
              </CardContent>
            </Card>

            {/* Performance Engine Simulator */}
            <Card id="engine-simulator-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="h-4.5 w-4.5 text-primary" />
                  Simuladores do Gateway (Mock Engine)
                </CardTitle>
                <CardDescription>
                  Ajuste os parâmetros de performance local para homologar logs e estados de carregamento.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap justify-between gap-2 text-xs">
                    <span className="break-anywhere text-foreground font-bold uppercase tracking-tight">Latência das Requisições</span>
                    <span className="text-primary font-bold font-mono bg-primary/10 px-1.5 py-0.5 rounded">{config.mockLatency}ms</span>
                  </div>
                  <input
                    type="range"
                    aria-label="Latência das requisições mockadas"
                    min="50"
                    max="3000"
                    step="50"
                    value={config.mockLatency}
                    onChange={(e) => {
                      updateConfig({ mockLatency: Number(e.target.value) });
                      addNotification(`Latência simulação ajustada: ${e.target.value}ms`, 'info');
                    }}
                    className="w-full accent-primary bg-muted rounded-lg h-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  />
                </div>

                <div className="border-t border-border/60 pt-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-black uppercase tracking-tight text-foreground block">
                      Simular Erro de Banco de Dados
                    </span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5 font-semibold">
                      Força interrupções estocásticas em conexões e loops ativos.
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label="Alternar simulação de erro de banco"
                    aria-pressed={config.simulateDbFailure}
                    onClick={() => {
                      const nextVal = !config.simulateDbFailure;
                      updateConfig({ simulateDbFailure: nextVal });
                      addNotification(
                        nextVal ? 'Interrupções no banco ativadas.' : 'Interrupções de banco normalizadas!',
                        nextVal ? 'error' : 'success'
                      );
                    }}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      config.simulateDbFailure ? 'bg-rose-500' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        config.simulateDbFailure ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {config.simulateDbFailure && (
                  <div className="flex gap-2.5 bg-rose-500/10 border border-rose-500/15 p-3.5 rounded-xl text-rose-500">
                    <div className="h-4 w-4 shrink-0 mt-0.5">
                      <AlertTriangle className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-[10px] font-semibold leading-relaxed">
                      Conexões ativas sofrerão quedas periódicas simuladas até que o status seja re-estabelecido.
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Mock connection parameters form */}
          <form
            onSubmit={handleConnectionSubmit(onSaveConnections)}
            className="lg:col-span-5 bg-card border border-border rounded-xl shadow-xs overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-border bg-muted/20 flex justify-between items-center">
              <span className="break-anywhere text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" /> Parâmetros de conexão mock
              </span>
              <span className="text-[9px] px-2 py-0.5 bg-primary/10 text-primary rounded font-black uppercase tracking-wider">
                Dockered Env
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <Input
                  label="API Endpoint Gateway"
                  placeholder="Ex: http://localhost:4000/api"
                  error={connectionErrors.apiEndpoint?.message}
                  {...regConnection('apiEndpoint')}
                />
              </div>

              <div className="space-y-1">
                <Input
                  label="Host mock de Banco"
                  placeholder="Ex: sql-primary-cluster"
                  error={connectionErrors.dbHost?.message}
                  {...regConnection('dbHost')}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Input
                    label="Porta TCP"
                    type="number"
                    placeholder="5432"
                    error={connectionErrors.dbPort?.message}
                    {...regConnection('dbPort')}
                  />
                </div>

                <div className="space-y-1">
                  <Input
                    label="Usuário mock"
                    placeholder="starter_admin"
                    error={connectionErrors.dbUser?.message}
                    {...regConnection('dbUser')}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border/40 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="break-anywhere text-[10px] text-muted-foreground">
                  Simula variáveis de ambiente para validação visual local.
                </p>
                <Button
                  id="btn-settings-infra-save"
                  type="submit"
                  className="w-full px-4 shrink-0 font-bold text-xs sm:w-auto"
                  isLoading={savingConfig}
                >
                  Salvar Parâmetros
                </Button>
              </div>
            </div>
          </form>

        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-6 md:p-8">
          <ComponentsGuide />
        </div>
      )}
    </div>
  );
}

export default SettingsShowcase;
