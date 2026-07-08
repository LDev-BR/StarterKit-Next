'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { ResponsiveDataView, type DataColumn } from '@/components/ui/responsive-data-view';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { SlideIn } from '@/components/animations/motion-presets';
import {
  TrendingUp,
  TrendingDown,
  Cpu,
  ShieldAlert,
  ChevronRight,
  Plus,
  Calendar,
  Lock,
  DollarSign,
  Activity,
  FolderKanban
} from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';

type DashboardLog = ReturnType<typeof useAppStore.getState>['logs'][number];
type DashboardTimeframe = 'today' | 'week';
type BalanceFilter = 'revenue' | 'expenditure';

interface RecentProjectRow {
  id: string;
  owner: string;
  project: string;
  status: 'success' | 'waiting' | 'processing';
  value: string;
}

const timeframeItems = [
  { value: 'today', label: 'Hoje' },
  { value: 'week', label: 'Semana' },
] as const;

const balanceFilterItems = [
  { value: 'revenue', label: 'Receita projetada' },
  { value: 'expenditure', label: 'Despesa estimada' },
] as const;

const recentProjectRows: RecentProjectRow[] = [
  {
    id: 'omega-gateway',
    owner: 'Admin Starter',
    project: 'Ã”mega API Gateway',
    status: 'success',
    value: '$1,450',
  },
  {
    id: 'kubernetes-replica',
    owner: 'Equipe Plataforma',
    project: 'Kubernetes Multi-Replica',
    status: 'waiting',
    value: '$3,100',
  },
  {
    id: 'mock-persistence',
    owner: 'Equipe Dados',
    project: 'PersistÃªncia mock multi-node',
    status: 'processing',
    value: '$450',
  },
];

function renderProjectStatus(status: RecentProjectRow['status']) {
  const statusMap = {
    success: {
      label: 'Sucesso',
      className: 'bg-green-500/15 text-green-600 dark:text-green-400',
    },
    waiting: {
      label: 'Em espera',
      className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    },
    processing: {
      label: 'Processando',
      className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    },
  } satisfies Record<RecentProjectRow['status'], { label: string; className: string }>;

  const statusItem = statusMap[status];

  return (
    <span className={`inline-flex w-fit rounded px-2 py-0.5 text-[9px] font-bold uppercase ${statusItem.className}`}>
      {statusItem.label}
    </span>
  );
}

const recentProjectColumns: DataColumn<RecentProjectRow>[] = [
  {
    key: 'owner',
    header: 'ResponsÃ¡vel',
    render: (row) => <span className="font-bold text-foreground">{row.owner}</span>,
  },
  {
    key: 'project',
    header: 'Projeto',
    render: (row) => <span className="break-anywhere text-muted-foreground">{row.project}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => renderProjectStatus(row.status),
  },
  {
    key: 'value',
    header: 'Valor',
    align: 'right',
    render: (row) => <span className="font-mono font-bold">{row.value}</span>,
  },
];

function renderLogStatus(status: DashboardLog['status']) {
  return (
    <span className={`inline-flex w-fit rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${
      status === 'success'
        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
    }`}>
      {status === 'success' ? 'OK' : 'AVISO'}
    </span>
  );
}

export function ShowcaseDashboard() {
  const { projects, logs, config, addLog, addNotification, updateConfig, user, setCurrentTab, subscription } = useAppStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [timeframe, setTimeframe] = useState<'today' | 'week'>('week');
  const [balanceFilter, setBalanceFilter] = useState<'revenue' | 'expenditure'>('revenue');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Dynamic calculations based on state values
  const totalBudget = projects.reduce((acc, curr) => acc + curr.allocatedBudget, 0);
  const isHealthy = !config.simulateDbFailure;

  const handleConfirmSync = () => {
    setIsActionLoading(true);
    addNotification('Efetuando re-sincronização do estado mockado...', 'info');
    
    setTimeout(() => {
      setIsActionLoading(false);
      setIsDialogOpen(false);
      
      if (config.simulateDbFailure) {
        updateConfig({ simulateDbFailure: false });
        addNotification('Estado mockado re-sincronizado. Simulação de banco normalizada!', 'success');
        addLog('Estado mock re-sincronizado', 'Simulação de banco recuperada com sucesso', 'success');
      } else {
        addNotification('Estado mockado re-sincronizado com êxito!', 'success');
        addLog('Estado mock re-sincronizado', 'Validação visual concluída', 'success');
      }
    }, Math.max(config.mockLatency, 800));
  };

  const forceRefresh = () => {
    addNotification('Varredura rápida no gateway de eventos...', 'info');
    addLog('Varredura manual efetuada', 'Monitoramento Geral', 'success');
  };

  const triggerCreateProject = () => {
    addNotification('Prompt: Acesse a aba "Projetos" para cadastrar um novo!', 'success');
  };

  // Format UTC strings cleanly
  const formatTime = (isoString: string) => {
    if (!mounted) {
      return '--:--:--';
    }
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Agora';
    }
  };

  const recentLogRows = logs.slice(0, 3);
  const logColumns: DataColumn<DashboardLog>[] = [
    {
      key: 'operator',
      header: 'Operador',
      render: (log) => (
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-[8px] font-bold uppercase text-primary">
            {log.userName.slice(0, 2)}
          </div>
          <span className="break-anywhere font-bold text-foreground">{log.userName}</span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'A\u00e7\u00e3o Efetuada',
      render: (log) => (
        <div className="flex min-w-0 flex-col gap-1">
          <span className="break-anywhere font-semibold text-foreground">{log.action}</span>
          <span className="w-fit rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
            {log.target}
          </span>
        </div>
      ),
    },
    {
      key: 'timestamp',
      header: 'Data/Hora',
      align: 'right',
      render: (log) => <span className="whitespace-nowrap text-muted-foreground">{formatTime(log.timestamp)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'right',
      render: (log) => <span className="inline-flex justify-end">{renderLogStatus(log.status)}</span>,
    },
  ];

  return (
    <div id="visual-showcase-dashboard" className="flex flex-col gap-6 w-full text-left">
      
      <PageHeader
        eyebrow={`Ola, ${user?.name.split(' ')[0] || 'Admin'},`}
        title="Bem-vindo de volta!"
        actions={(
          <>
            <SegmentedControl<DashboardTimeframe>
              items={timeframeItems}
              value={timeframe}
              onValueChange={(nextTimeframe) => {
                setTimeframe(nextTimeframe);
                addNotification(`Filtro alterado para: ${nextTimeframe === 'today' ? 'Hoje' : 'Semana'}`, 'info');
              }}
              ariaLabel="Intervalo do dashboard"
              size="sm"
              className="bg-card/80"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => addNotification('Filtro de calendario aberto', 'info')}
              className="rounded-xl"
              aria-label="Escolher periodo"
            >
              <Calendar size={15} />
            </Button>
            <Button
              onClick={triggerCreateProject}
              className="rounded-xl bg-[#0084ff] px-4 text-xs font-bold text-white shadow-md shadow-[#0084ff]/10 hover:bg-[#0072f5] hover:shadow-[#0084ff]/20"
            >
              <Plus size={15} className="stroke-[3]" />
              <span className="truncate">Criar novo projeto</span>
            </Button>
          </>
        )}
      />


      {/* Dynamic Health Warning Banner if DB Error is ON */}
      {!isHealthy && (
        <SlideIn direction="down">
          <div className="flex gap-4 bg-rose-500/10 border-2 border-rose-500/20 p-5 rounded-xl text-rose-500 shadow-sm">
            <ShieldAlert className="h-6 w-6 shrink-0 mt-0.5 animate-pulse text-rose-500" />
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-wide">
                Alerta crítico: simulação de persistência interrompida
              </h4>
              <p className="text-xs text-rose-400 leading-relaxed font-semibold">
                O sinalizador de falha mock foi ativado nas configurações. A interface permanece em estado degradado até que a simulação seja normalizada.
              </p>
              <div className="pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/25 cursor-pointer text-xs font-black uppercase"
                >
                  Forçar Restabelecimento
                </Button>
              </div>
            </div>
          </div>
        </SlideIn>
      )}

      {/* Giant Balance Card with high-fidelity Wave Trends & Tooltip from image */}
      <Card id="saas-balance-primary-card" className="border border-border bg-card shadow-sm overflow-hidden rounded-2xl">
        <div className="p-6 md:p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 text-left">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Saldo</h3>
              {/* Giant Balance Number */}
              <div className="flex items-center gap-3">
                <span className="text-3xl md:text-4xl font-black text-foreground">$10.080</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black">
                  ↗ 24%
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">
                ORÇAMENTO ATIVO DE PROJETOS: <span className="text-foreground">${totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </p>
            </div>

            <SegmentedControl<BalanceFilter>
              items={balanceFilterItems}
              value={balanceFilter}
              onValueChange={setBalanceFilter}
              ariaLabel={'Tipo de or\u00e7amento'}
              size="sm"
              className="self-start bg-neutral-100/60 dark:bg-neutral-800/30"
            />

          </div>

          {/* Glowing Wavy Line Chart exactly matching the reference artwork */}
          <div className="h-64 relative flex items-end w-full group">
            {/* Absolute floating Tooltip inspired exactly by image Saturday marker */}
            <div className="absolute top-[40px] right-[10%] md:right-[15%] z-20 flex flex-col items-center">
              <div className="bg-white dark:bg-white text-black px-3.5 py-1.5 rounded-xl shadow-lg border border-neutral-100 dark:border-white text-center flex flex-col pointer-events-none animate-bounce">
                <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider leading-none">Qua, 22 Out</span>
                <span className="text-xs font-black text-neutral-800 mt-1 leading-none">$2,124</span>
              </div>
              {/* Little anchor pointer line & dot */}
              <div className="h-4.5 w-[1px] bg-white/70 dark:bg-neutral-800/60" />
              <div className="h-3 w-3 rounded-full bg-[#0084ff] border-3 border-white dark:border-white shadow-md shadow-[#0084ff]/50" />
            </div>

            {/* Grid dotted lines background */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-2 border-b border-border/20">
              <div className="w-full border-t border-dashed border-border/10" />
              <div className="w-full border-t border-dashed border-border/10" />
              <div className="w-full border-t border-dashed border-border/10" />
              <div className="w-full border-t border-dashed border-border/10" />
            </div>

            {/* SVG responsive glowing curve */}
            <svg className="w-full h-4/5 overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
              <defs>
                {/* Purple to Indigo Glow gradient for path fill */}
                <linearGradient id="waveGlowFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#db2777" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="glowLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="40%" stopColor="#d946ef" />
                  <stop offset="80%" stopColor="#0084ff" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>

              {/* Area filled graph */}
              <path
                d="M 0,160 L 0,110 Q 50,115 100,85 T 200,90 T 300,70 T 400,105 T 500,45 T 600,30 L 600,160 Z"
                fill="url(#waveGlowFill)"
              />

              {/* Glowing stroke path */}
              <path
                d="M 0,110 Q 50,115 100,85 T 200,90 T 300,70 T 400,105 T 500,45 T 600,30"
                fill="none"
                stroke="url(#glowLineGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="filter drop-shadow-[0_2px_10px_rgba(139,92,246,0.5)]"
              />

              {/* Interactive Anchor Dots */}
              <circle cx="100" cy="85" r="4.5" className="fill-background stroke-[#8b5cf6]" strokeWidth="2.5" />
              <circle cx="300" cy="70" r="4.5" className="fill-background stroke-[#d946ef]" strokeWidth="2.5" />
              <circle cx="500" cy="45" r="4.5" className="fill-background stroke-[#0084ff]" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Calendar week markers label */}
          <div className="flex justify-between text-[11px] font-black text-muted-foreground uppercase tracking-widest border-t border-border/40 pt-4">
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
            <span>Dom</span>
          </div>
        </div>

        {/* Card bottom details grid split dynamically by borders exactly as in image illustration */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-border bg-neutral-100/10 dark:bg-neutral-800/10">
          
          <div className="p-5 flex flex-col text-left space-y-1.5 border-r border-border md:border-r">
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Projetos ativos</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-foreground">$3.236</span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-500">
                <TrendingUp size={11} />
              </span>
            </div>
          </div>

          <div className="p-5 flex flex-col text-left space-y-1.5 border-r border-border md:border-r">
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Uso de API</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-foreground">$3.764</span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-rose-500">
                <TrendingDown size={11} />
              </span>
            </div>
          </div>

          <div className="p-5 flex flex-col text-left space-y-1.5 border-r border-border md:border-r">
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Budget mock</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-foreground">$1.800</span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-500">
                <TrendingUp size={11} />
              </span>
            </div>
          </div>

          <div className="p-5 flex flex-col text-left space-y-1.5">
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Alertas visuais</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-foreground">$1.200</span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-rose-500">
                <TrendingDown size={11} />
              </span>
            </div>
          </div>

        </div>
      </Card>

      {/* Double Column Grid Area exact as portrayals in the image */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* Concentric Progress Loop (col-span-1) */}
        <Card id="saas-order-concentric-card" className="border border-border bg-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border/40">
              <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Projetos</h3>
              <button 
                onClick={() => {
                  setCurrentTab('projects');
                  addNotification('Redirecionando para visual de gestão de projetos', 'info');
                }}
                className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-0.5 hover:underline"
              >
                <span>Detalhes</span>
                <ChevronRight size={11} />
              </button>
            </div>

            <div className="flex items-center gap-6 py-6">
              {/* Left stats column */}
              <div className="space-y-4 text-left">
                <div className="space-y-0.5">
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest leading-none">Projetos monitorados</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-3xl font-black text-foreground">86</span>
                    <span className="text-emerald-500 text-xs font-black">↗</span>
                  </div>
                </div>

                {/* Vertical list list matches design layout parameters */}
                <div className="space-y-2 text-[10px] font-black uppercase tracking-wider">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-[#8b5cf6]" />
                    <span>Sucesso <b className="text-foreground ml-1">24</b></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-[#db2777]" />
                    <span>Em espera <b className="text-foreground ml-1">32</b></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                    <span>Cancelado <b className="text-foreground ml-1">16</b></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                    <span>Processando <b className="text-foreground ml-1">14</b></span>
                  </div>
                </div>
              </div>

              {/* Dynamic Concentric circle renderer inside responsive SVG */}
              <div className="flex-1 flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
                  {/* Circle loops pointing outward inside each other */}
                  {/* Success (Purple) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#eaecee"
                    className="dark:stroke-neutral-800"
                    strokeWidth="4.5"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#8b5cf6"
                    strokeWidth="4.5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={2 * Math.PI * 38 * (1 - 0.75)}
                    strokeLinecap="round"
                  />

                  {/* Waiting (Pink/Crimson) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="30"
                    stroke="#eaecee"
                    className="dark:stroke-neutral-800"
                    strokeWidth="4.5"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="30"
                    stroke="#db2777"
                    strokeWidth="4.5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 30}
                    strokeDashoffset={2 * Math.PI * 30 * (1 - 0.6)}
                    strokeLinecap="round"
                  />

                  {/* Cancel (Red) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="22"
                    stroke="#eaecee"
                    className="dark:stroke-neutral-800"
                    strokeWidth="4.5"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="22"
                    stroke="#ef4444"
                    strokeWidth="4.5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 22}
                    strokeDashoffset={2 * Math.PI * 22 * (1 - 0.35)}
                    strokeLinecap="round"
                  />

                  {/* Processing (Green) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="14"
                    stroke="#eaecee"
                    className="dark:stroke-neutral-800"
                    strokeWidth="4.5"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="14"
                    stroke="#10b981"
                    strokeWidth="4.5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 14}
                    strokeDashoffset={2 * Math.PI * 14 * (1 - 0.45)}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground font-semibold uppercase leading-tight pt-3 border-t border-border/40 text-left">
            Análise visual de fluxos SaaS e validação de estados
          </div>
        </Card>

        {/* Recent project listing with glass blur overlay "Unlock Pro" (col-span-2) */}
        <Card id="saas-recent-orders-locked-card" className="border border-border bg-card rounded-2xl p-6 lg:col-span-2 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-border/40">
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Projetos recentes</h3>
            <button 
              onClick={() => {
                addNotification('Desbloqueie o plano Pro para visualizar mais detalhes.', 'warning');
              }}
              className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-0.5 hover:underline"
            >
              <span>Detalhes</span>
              <ChevronRight size={11} />
            </button>
          </div>

          <div className="flex-grow relative mt-4">
            
            {/* Absolute floating Glass blur block cover mimicking the image EXACTLY */}
            {subscription === 'free' && (
              <div className="absolute inset-0 z-30 flex items-center justify-center">
                <div className="bg-[#121319]/90 dark:bg-[#0c0d12]/95 border border-[#23253a]/60 text-white rounded-2xl p-6 shadow-xl text-center max-w-sm w-full mx-auto flex flex-col items-center space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 relative">
                    <div className="absolute -inset-1 rounded-xl bg-purple-500/10 blur-md" />
                    <Lock size={18} className="relative mt-0.5" />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-base font-black uppercase tracking-wider">Desbloquear Pro</h4>
                    <p className="text-[11px] text-neutral-400 font-bold leading-normal">
                      Faça upgrade para o Pro para desbloquear este recurso demonstrativo e visualizar mais dados mockados
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setCurrentTab('billing');
                      addNotification('Notificação: Selecione o plano Pro ou Enterprise para efetuar o desbloqueio.', 'success');
                    }}
                    className="w-full bg-white text-black hover:bg-neutral-100 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-98 shadow-sm"
                  >
                    Começar
                  </button>
                </div>
              </div>
            )}

            <div className={`w-full ${subscription === 'free' ? 'filter blur-[5px] opacity-20 pointer-events-none select-none' : ''}`}>
              <ResponsiveDataView<RecentProjectRow>
                rows={recentProjectRows}
                columns={recentProjectColumns}
                getRowKey={(row) => row.id}
                ariaLabel="Projetos recentes"
                emptyState={{
                  title: 'Nenhum projeto recente',
                  description: 'Os projetos desbloqueados aparecem aqui conforme o uso do starter kit.',
                }}
                tableClassName="text-xs"
                renderMobileCard={(row) => (
                  <article className="rounded-xl border border-border/70 bg-muted/20 p-4">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="break-anywhere text-sm font-black text-foreground">{row.project}</h4>
                        <p className="mt-1 break-anywhere text-xs font-semibold text-muted-foreground">{row.owner}</p>
                      </div>
                      <span className="shrink-0 font-mono text-xs font-bold text-foreground">{row.value}</span>
                    </div>
                    <div className="mt-3">{renderProjectStatus(row.status)}</div>
                  </article>
                )}
              />
            </div>


          </div>

          <div className="text-[10px] text-muted-foreground font-semibold uppercase leading-none pt-3.5 border-t border-border/40 mt-auto text-left">
            Gateway visual de projetos em modo de demonstração
          </div>
        </Card>

      </div>

      {/* Database / Host metrics panel row of original starter-kit */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mt-1">
        
        {/* System Health / API Config */}
        <Card id="health-check-card" className="flex flex-col border border-border bg-card shadow-sm rounded-2xl p-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-4">Ambiente Mock & Gateway</h3>
          
          <div className="flex-1 flex flex-col gap-4 justify-center">
            {/* Cluster Status Ring */}
            <div className="flex items-center gap-4 pb-3 border-b border-border/40">
              <span className="relative flex h-2.5 w-2.5">
                {isHealthy ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </>
                ) : (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </>
                )}
              </span>
              <div className="text-left">
                <p className="text-xs font-bold uppercase text-foreground">
                  {isHealthy ? 'Mock operacional' : 'Mock degradado'}
                </p>
                <p className="text-[9px] text-muted-foreground leading-none mt-1">Uptime auditável de {isHealthy ? '99.98%' : '74.20%'}</p>
              </div>
            </div>

            {/* Health parameters */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">Parâmetro de Latência:</span>
                <span className="font-mono font-bold text-foreground">{config.mockLatency} ms</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">Gateway OAuth / JWT:</span>
                <span className="text-green-600 dark:text-green-400 font-bold uppercase text-[9px] bg-green-500/10 px-2 py-0.5 rounded">Ativo</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">Persistência simulada:</span>
                {isHealthy ? (
                  <span className="text-green-600 dark:text-green-400 font-bold uppercase text-[9px] bg-green-500/10 px-2 py-0.5 rounded">ONLINE</span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-bold uppercase text-[9px] bg-rose-500/10 px-2 py-0.5 rounded animate-pulse">DOWN</span>
                )}
              </div>
            </div>

            {/* Action hooks */}
            <div className="flex gap-2.5 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs cursor-pointer font-bold rounded-xl" 
                onClick={() => {
                  addNotification(`Host mock configurado: ${config.dbHost}:${config.dbPort}`, 'info');
                }}
              >
                Inspecionar VEs
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="w-full text-xs cursor-pointer font-bold rounded-xl" 
                onClick={() => setIsDialogOpen(true)}
              >
                Re-sincronizar mock
              </Button>
            </div>
          </div>
        </Card>

        {/* Activity Logs Table inside Card (col-span-2) */}
        <Card id="logs-history-card" className="md:col-span-2 border border-border bg-card shadow-sm rounded-2xl p-6">
          <div className="mb-4 flex flex-col gap-3 border-b border-border/40 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Eventos Operacionais Recentes</h3>
            <span className="text-[10px] text-muted-foreground font-bold">Rastro Auditável de Logs</span>
            <Button
              variant="outline"
              size="sm"
              onClick={forceRefresh}
              className="w-full rounded-xl text-xs font-bold sm:w-auto"
            >
              <Activity size={13} />
              <span>Varrer eventos</span>
            </Button>
          </div>

          <ResponsiveDataView<DashboardLog>
            rows={recentLogRows}
            columns={logColumns}
            getRowKey={(log) => log.id}
            ariaLabel="Eventos operacionais recentes"
            emptyState={{
              title: 'Nenhum evento registrado',
              description: 'Nenhum evento registrado no pipeline do gateway.',
            }}
            tableClassName="text-xs"
            renderMobileCard={(log) => (
              <article className="rounded-xl border border-border/70 bg-muted/20 p-4">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="break-anywhere text-sm font-black text-foreground">{log.action}</h4>
                    <p className="mt-1 w-fit rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {log.target}
                    </p>
                  </div>
                  {renderLogStatus(log.status)}
                </div>
                <div className="mt-4 flex min-w-0 items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span className="break-anywhere font-bold text-foreground">{log.userName}</span>
                  <span className="shrink-0 whitespace-nowrap">{formatTime(log.timestamp)}</span>
                </div>
              </article>
            )}
          />

        </Card>

      </div>

      {/* Confirmation Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmSync}
        title="Confirmar re-sincronização do mock?"
        description="Esta operação normaliza o estado simulado de infraestrutura e registra um evento visual no histórico local."
        confirmText="Confirmar sincronização"
        cancelText="Voltar"
        type="warning"
        isConfirmLoading={isActionLoading}
      />
    </div>
  );
}

export default ShowcaseDashboard;
