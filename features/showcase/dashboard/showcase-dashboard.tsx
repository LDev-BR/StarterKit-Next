'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SlideIn } from '@/components/animations/motion-presets';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Cpu,
  ShieldAlert,
  Zap,
  ChevronRight,
  Plus,
  Calendar,
  Lock,
  DollarSign,
  Activity,
  FolderKanban
} from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';

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

  const triggerCreateOrder = () => {
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

  return (
    <div id="visual-showcase-dashboard" className="flex flex-col gap-6 w-full text-left">
      
      {/* Title Header matching original artwork */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
            Olá, {user?.name.split(' ')[0] || 'Felix'},
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
            👋 Bem-vindo de volta!
          </h1>
        </div>
        
        {/* Date Filters & Main Action CTA exactly as in image */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Today / Week filter capsule button */}
          <div className="inline-flex items-center p-1 rounded-xl bg-card border border-border bg-neutral-100/50 dark:bg-neutral-800/25">
            <button
              onClick={() => {
                setTimeframe('today');
                addNotification('Filtro alterado para: Hoje', 'info');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'today'
                  ? 'bg-white dark:bg-neutral-900 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => {
                setTimeframe('week');
                addNotification('Filtro alterado para: Semana', 'info');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'week'
                  ? 'bg-white dark:bg-neutral-900 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Semana
            </button>
          </div>

          {/* Calendar Selector */}
          <button
            onClick={() => addNotification('Filtro de calendário aberto', 'info')}
            className="h-9 w-9 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors hover:bg-muted/30 cursor-pointer"
            aria-label="Escolher período"
          >
            <Calendar size={15} />
          </button>

          {/* "+ Create new order" sky blue button representing the image exactly */}
          <button
            onClick={triggerCreateOrder}
            className="h-9.5 px-4.5 rounded-xl bg-[#0084ff] hover:bg-[#0072f5] text-white text-xs font-bold transition-all shadow-md shadow-[#0084ff]/10 hover:shadow-[#0084ff]/20 active:scale-98 cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={15} className="stroke-[3]" />
            <span>Criar novo pedido</span>
          </button>
        </div>
      </div>

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

            {/* Total Revenue / Total Expenditure pill selectors */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100/60 dark:bg-neutral-800/30 border border-border self-start">
              <button
                onClick={() => setBalanceFilter('revenue')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-all ${
                  balanceFilter === 'revenue'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Receita total
              </button>
              <button
                onClick={() => setBalanceFilter('expenditure')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-all ${
                  balanceFilter === 'expenditure'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Despesa total
              </button>
            </div>
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
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Loja física</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-foreground">$3.236</span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-500">
                <TrendingUp size={11} />
              </span>
            </div>
          </div>

          <div className="p-5 flex flex-col text-left space-y-1.5 border-r border-border md:border-r">
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Loja online</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-foreground">$3.764</span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-rose-500">
                <TrendingDown size={11} />
              </span>
            </div>
          </div>

          <div className="p-5 flex flex-col text-left space-y-1.5 border-r border-border md:border-r">
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Cobrança</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-foreground">$1.800</span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-500">
                <TrendingUp size={11} />
              </span>
            </div>
          </div>

          <div className="p-5 flex flex-col text-left space-y-1.5">
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Outros valores</span>
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
              <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Pedidos</h3>
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
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest leading-none">Total de pedidos</p>
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
            Análise em tempo real de fluxos e conversões
          </div>
        </Card>

        {/* Recent orders listing with beautiful glass blur overlay "Unlock Pro" (col-span-2) */}
        <Card id="saas-recent-orders-locked-card" className="border border-border bg-card rounded-2xl p-6 lg:col-span-2 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-border/40">
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Pedidos recentes</h3>
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

            {/* Blurred Table mock beneath overlay */}
            <div className={`w-full overflow-x-auto ${subscription === 'free' ? 'filter blur-[5px] opacity-20 pointer-events-none select-none' : ''}`}>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground uppercase text-[9px] font-black tracking-widest bg-muted/20">
                    <th className="py-2.5 px-3">Cliente</th>
                    <th className="py-2.5 px-3">Nome do Produto</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/20">
                    <td className="py-3 px-3 font-bold">Ronald Richards</td>
                    <td className="py-3 px-3">Ômega API Gateway</td>
                    <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-green-500/15 text-green-500 uppercase text-[9px] font-bold">Sucesso</span></td>
                    <td className="py-3 px-3 text-right font-mono font-bold">$1,450</td>
                  </tr>
                  <tr className="border-b border-border/20">
                    <td className="py-3 px-3 font-bold">Annette Black</td>
                    <td className="py-3 px-3">Kubernetes Multi-Replica</td>
                    <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 uppercase text-[9px] font-bold">Em espera</span></td>
                    <td className="py-3 px-3 text-right font-mono font-bold">$3,100</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold">Albert Flores</td>
                    <td className="py-3 px-3">Persistência mock multi-node</td>
                    <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-500 uppercase text-[9px] font-bold">Processando</span></td>
                    <td className="py-3 px-3 text-right font-mono font-bold font-black">$450</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          <div className="text-[10px] text-muted-foreground font-semibold uppercase leading-none pt-3.5 border-t border-border/40 mt-auto text-left">
            Gateway local de transações em modo de demonstração
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
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/40">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Eventos Operacionais Recentes</h3>
            <span className="text-[10px] text-muted-foreground font-bold">Rastro Auditável de Logs</span>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground uppercase text-[9px] font-black tracking-widest bg-muted/30">
                  <th className="py-2.5 px-3">Operador</th>
                  <th className="py-2.5 px-3">Ação Efetuada</th>
                  <th className="py-2.5 px-3 text-right">Data/Hora</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground font-medium">
                      Nenhum evento registrado no pipeline do gateway.
                    </td>
                  </tr>
                ) : (
                  logs.slice(0, 3).map((log) => (
                    <tr key={log.id} className="border-b border-border/20 last:border-b-0 hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full border border-primary/25 bg-primary/10 flex items-center justify-center font-bold text-[8px] uppercase text-primary shrink-0">
                            {log.userName.slice(0, 2)}
                          </div>
                          <span className="font-bold text-foreground truncate max-w-[100px]">{log.userName}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground leading-none">{log.action}</span>
                          <span className="font-mono text-[8px] text-muted-foreground mt-1 bg-muted px-1 py-0.5 rounded w-fit">{log.target}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right text-muted-foreground font-medium whitespace-nowrap">
                        {formatTime(log.timestamp)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          log.status === 'success'
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {log.status === 'success' ? 'OK' : 'AVISO'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
