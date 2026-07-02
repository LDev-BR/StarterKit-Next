'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  Activity,
  Sun,
  Moon,
  Monitor,
  Layers
} from 'lucide-react';
import { useTheme } from '@/providers/theme-provider';
import { ComponentsGuide } from '../components/components-guide';

const connectionSchema = z.object({
  apiEndpoint: z.string().url({ message: 'O endpoint da API REST deve ser uma URL válida (HTTP/HTTPS).' }),
  dbHost: z.string().min(2, { message: 'O Host do banco PostgreSQL deve possuir pelo menos 2 caracteres.' }),
  dbPort: z.coerce.number().min(1024).max(65535, { message: 'Portas TCP válidas estão entre 1024 e 65535.' }),
  dbUser: z.string().min(2, { message: 'Inutilize namespaces vazios para usuário do banco.' }),
});

const profileSchema = z.object({
  name: z.string().min(2, { message: 'O nome de usuário deve conter pelo menos 2 letras.' }),
  email: z.string().email({ message: 'Insira um e-mail institucional válido.' }),
});

type ConnectionFormInput = z.input<typeof connectionSchema>;
type ConnectionFormData = z.output<typeof connectionSchema>;
type ProfileFormData = z.output<typeof profileSchema>;

export function SettingsShowcase() {
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

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'infrastructure' | 'appearance' | 'design'>('profile');
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

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

  return (
    <div id="settings-showcase-container" className="space-y-6 text-left">
      {/* Title block */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground md:text-3xl uppercase">
          Configurações Integradas
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Gerencie seu perfil operativo, controle chaves criptográficas de API e administre conectores locais de banco de dados.
        </p>
      </div>

      {/* Internal Settings Subtab Navigator */}
      <div className="flex border-b border-border/60 gap-4">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-b-2 px-1 relative top-[1px] ${
            activeSubTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Perfil & Segurança JWT
        </button>
        <button
          onClick={() => setActiveSubTab('appearance')}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-b-2 px-1 relative top-[1px] ${
            activeSubTab === 'appearance'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Aparência do Painel
        </button>
        <button
          onClick={() => setActiveSubTab('infrastructure')}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-b-2 px-1 relative top-[1px] ${
            activeSubTab === 'infrastructure'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Conectores de API & Infra
        </button>
        <button
          onClick={() => setActiveSubTab('design')}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-b-2 px-1 relative top-[1px] ${
            activeSubTab === 'design'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Design System
        </button>
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
                    <span className="font-mono text-[9px] text-muted-foreground block mt-1.5 truncate">
                      {user.token}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t border-border/40 bg-muted/10 px-6 py-4 flex justify-between items-center gap-4">
              <p className="text-[10px] text-muted-foreground leading-snug">
                Mudanças aplicam-se instantaneamente na sidebar e fluxo de logs.
              </p>
              <Button
                id="btn-profile-save"
                type="submit"
                className="h-9 px-4 shrink-0 font-bold text-xs"
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
                  Inspecione o cabeçalho Bearer autenticado por criptografia local.
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
                  <div className="space-y-2.5 bg-muted/40 border border-border/80 rounded-xl p-3.5 relative overflow-hidden font-mono text-[9px] leading-relaxed text-muted-foreground text-left whitespace-pre-wrap select-all">
                    Bearer {user.token}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    id="btn-copy-jwt"
                    variant="outline"
                    onClick={handleCopyToken}
                    className="flex-1 text-xs font-black uppercase tracking-wider h-9 gap-1.5 cursor-pointer"
                  >
                    {copiedToken ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    Copiar Token Bearer
                  </Button>
                  
                  <Button
                    id="btn-perform-logout"
                    variant="ghost"
                    onClick={logout}
                    className="h-9 font-black text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 uppercase tracking-wider cursor-pointer"
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
                  onClick={() => {
                    setTheme('light');
                    addNotification('Tema alterado para Modo Claro!', 'success');
                  }}
                  className={`flex flex-col items-center justify-center p-5 rounded-xl border transition-all cursor-pointer text-center gap-3 ${
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
                  onClick={() => {
                    setTheme('dark');
                    addNotification('Tema alterado para Modo Escuro!', 'success');
                  }}
                  className={`flex flex-col items-center justify-center p-5 rounded-xl border transition-all cursor-pointer text-center gap-3 ${
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
                  onClick={() => {
                    setTheme('system');
                    addNotification('Tema ajustado para seguir as preferências do Sistema!', 'success');
                  }}
                  className={`flex flex-col items-center justify-center p-5 rounded-xl border transition-all cursor-pointer text-center gap-3 ${
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
                  <span className="text-[10px] font-black uppercase tracking-wider text-foreground">
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
                  Use essas chaves para autenticar requisições de microsserviços externos no gateway de segurança do starter kit.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Generate Key Input */}
                <form onSubmit={handleGenerateKey} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Nome do Token (Ex: Staging Gateway)"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="bg-background border border-border rounded-lg h-9 flex-1 px-3 text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <Button id="btn-generate-key" type="submit" size="sm" className="gap-2 shrink-0 cursor-pointer text-xs font-bold">
                    <Plus className="h-3.5 w-3.5" /> Gerar Chave
                  </Button>
                </form>

                {/* Keys Lists */}
                <div className="space-y-2.5 pt-2">
                  {apiKeys.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4 font-semibold">
                      Nenhuma chave cadastrada atualmente.
                    </p>
                  ) : (
                    apiKeys.map((key) => (
                      <div
                        key={key.id}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border border-border rounded-lg bg-muted/20 gap-3"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-black text-foreground uppercase tracking-tight">
                            {key.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <code className="text-[10px] bg-background border border-border/60 text-muted-foreground px-1.5 py-0.5 rounded font-mono select-all font-bold">
                              {key.key.substring(0, 14)}••••••••{key.key.substring(key.key.length - 6)}
                            </code>
                            <button
                              type="button"
                              onClick={() => handleCopyKey(key.id, key.key)}
                              className="text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              {copiedKeyId === key.id ? (
                                <Check className="h-3.5 w-3.5 text-green-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 border-border/40 pt-2 sm:pt-0">
                          <span className="text-[9px] text-muted-foreground font-bold">
                            Uso: {key.lastUsed !== 'Nunca' ? 'Há 5m' : 'Nunca'}
                          </span>
                          <Button
                            id={`btn-revoke-key-${key.id}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevokeKey(key.id, key.name)}
                            className="h-7 w-7 p-0 text-muted-foreground hover:bg-rose-500/15 hover:text-rose-500 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
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
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-foreground font-bold uppercase tracking-tight">Latência das Requisições</span>
                    <span className="text-primary font-bold font-mono bg-primary/10 px-1.5 py-0.5 rounded">{config.mockLatency}ms</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="3000"
                    step="50"
                    value={config.mockLatency}
                    onChange={(e) => {
                      updateConfig({ mockLatency: Number(e.target.value) });
                      addNotification(`Latência simulação ajustada: ${e.target.value}ms`, 'info');
                    }}
                    className="w-full accent-primary bg-muted rounded-lg h-1.5 cursor-pointer"
                  />
                </div>

                <div className="border-t border-border/60 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-tight text-foreground block">
                      Simular Erro de Banco de Dados
                    </span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5 font-semibold">
                      Força interrupções estocásticas em conexões e loops ativos.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !config.simulateDbFailure;
                      updateConfig({ simulateDbFailure: nextVal });
                      addNotification(
                        nextVal ? 'Interrupções no banco ativadas.' : 'Interrupções de banco normalizadas!',
                        nextVal ? 'error' : 'success'
                      );
                    }}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
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

          {/* Docker-compose PostgreSQL connect parameters form */}
          <form
            onSubmit={handleConnectionSubmit(onSaveConnections)}
            className="lg:col-span-5 bg-card border border-border rounded-xl shadow-xs overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-border bg-muted/20 flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" /> Parâmetros PostgreSQL
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
                  label="Host do Banco de Dados"
                  placeholder="Ex: sql-primary-cluster"
                  error={connectionErrors.dbHost?.message}
                  {...regConnection('dbHost')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    label="Usuário Master"
                    placeholder="starter_admin"
                    error={connectionErrors.dbUser?.message}
                    {...regConnection('dbUser')}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-between items-center gap-4">
                <p className="text-[10px] text-muted-foreground">
                  Simula variáveis de ambiente lidas pelo core contêiner.
                </p>
                <Button
                  id="btn-settings-infra-save"
                  type="submit"
                  className="h-9 px-4 shrink-0 font-bold text-xs"
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
