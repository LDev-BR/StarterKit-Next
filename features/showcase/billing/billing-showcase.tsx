'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Zap, 
  Check, 
  ArrowRight, 
  FileText, 
  Download, 
  Shield, 
  Cpu, 
  Database,
  Users,
  Activity,
  Sparkles
} from 'lucide-react';

export function BillingShowcase() {
  const { 
    subscription, 
    setSubscription, 
    addNotification, 
    apiUsage, 
    dbUsage,
    user
  } = useAppStore();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      price: 0,
      description: 'Ideal para experimentação e prototipagem local.',
      features: [
        'Banco de dados compartilhado',
        'Limite de 10.000 requisições/mês',
        '1 Chave de API ativa',
        'Painel em tempo real básico',
        'Suporte via comunidade'
      ],
      cta: 'Plano Atual',
      activeId: 'free'
    },
    {
      id: 'pro',
      name: 'Pro Developer',
      price: 10,
      description: 'Ideal para projetos em crescimento e integração contínua.',
      features: [
        'Banco PostgreSQL auto-escalável',
        'Até 100.000 requisições/mês',
        'Chaves de API ilimitadas',
        'Replicação em múltiplos containers',
        'Suporte prioritário 24/7'
      ],
      cta: 'Upgrade para Pro',
      activeId: 'pro'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      description: 'Desempenho máximo e isolamento completo para sua corporação.',
      features: [
        'Cluster PostgreSQL exclusivo dedicado',
        'SLA de 99.99% garantido em contrato',
        'Controle completo de criptografia JWT',
        'Backup automático de hora em hora',
        'Gerente de conta exclusivo'
      ],
      cta: 'Contatar Vendas',
      activeId: 'enterprise'
    }
  ];

  const invoices = [
    { id: 'INV-2026-004', date: '18 Jun, 2026', amount: subscription === 'enterprise' ? '$99.00' : subscription === 'pro' ? '$10.00' : '$0.00', status: 'Pago' },
    { id: 'INV-2026-003', date: '18 Mai, 2026', amount: subscription === 'enterprise' ? '$99.00' : subscription === 'pro' ? '$10.00' : '$0.00', status: 'Pago' },
    { id: 'INV-2026-002', date: '18 Abr, 2026', amount: '$0.00', status: 'Pago' },
    { id: 'INV-2026-001', date: '18 Mar, 2026', amount: '$0.00', status: 'Pago' },
  ];

  const handleSelectPlan = (tier: 'free' | 'pro' | 'enterprise') => {
    if (tier === 'enterprise') {
      addNotification('Solicitação enviada! Nossa equipe de vendas corporativas entrará em contato.', 'info');
      return;
    }
    
    if (subscription === tier) {
      addNotification('Você já está utilizando este plano de assinatura!', 'warning');
      return;
    }

    setSubscription(tier);
    addNotification(`Parabéns! Sua assinatura foi alterada para o plano ${tier.toUpperCase()} com sucesso.`, 'success');
  };

  const getPlanPrice = (price: number) => {
    if (price === 0) return 'Grátis';
    const computedPrice = billingCycle === 'annually' ? price * 0.8 : price;
    return `$${computedPrice.toFixed(2)}`;
  };

  return (
    <div id="saas-billing-container" className="flex flex-col gap-8 w-full text-left">
      {/* Title & Cycle selector Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground md:text-3xl uppercase flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Assinatura & Faturamento
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie o ciclo de cobrança do seu SaaS, acompanhe o limite de uso das cotas de recursos e melhore sua infraestrutura.
          </p>
        </div>

        {/* Toggle Billing Cycle */}
        <div className="flex items-center gap-2 p-1 bg-neutral-100/60 dark:bg-neutral-800/30 border border-border rounded-xl">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
              billingCycle === 'monthly'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle('annually')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center gap-1 ${
              billingCycle === 'annually'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Anual</span>
            <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] rounded font-black uppercase">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Main SaaS Stats Overview (Usage Gauges) */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        
        {/* API Requests Quota block */}
        <Card className="border border-border bg-card p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-500" /> API Requests volume
              </span>
              <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded font-bold">
                {((apiUsage / (subscription === 'free' ? 10000 : subscription === 'pro' ? 100000 : 1000000)) * 100).toFixed(0)}%
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-foreground">
                  {apiUsage.toLocaleString('pt-BR')} 
                </span>
                <span className="text-xs text-muted-foreground font-semibold">
                  / {subscription === 'free' ? '10k' : subscription === 'pro' ? '100k' : 'Ilimitado'} reqs
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">Consumo estimado do mês corrente</p>
            </div>

            {/* Custom tailored progress bar */}
            <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min((apiUsage / (subscription === 'free' ? 10000 : subscription === 'pro' ? 100000 : 1000000)) * 100, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider pt-3 border-t border-border/40 mt-4">
            Ciclo reinicia em 12 dias
          </p>
        </Card>

        {/* Database Storage Row Quota block */}
        <Card className="border border-border bg-card p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Database className="h-4 w-4 text-purple-500" /> PostgreSQL Storage
              </span>
              <span className="text-[10px] bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded font-bold">
                {((dbUsage / (subscription === 'free' ? 1 : subscription === 'pro' ? 10 : 100)) * 100).toFixed(0)}%
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-foreground">
                  {dbUsage.toFixed(1)} GB
                </span>
                <span className="text-xs text-muted-foreground font-semibold">
                  / {subscription === 'free' ? '1 GB' : subscription === 'pro' ? '10 GB' : '100 GB'}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">Tamanho total dos índices & tabelas SQL</p>
            </div>

            {/* Custom tailored progress bar */}
            <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 transition-all duration-500 rounded-full"
                style={{ width: `${(dbUsage / (subscription === 'free' ? 1 : subscription === 'pro' ? 10 : 100)) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider pt-3 border-t border-border/40 mt-4">
            Replicação ativa em tempo real
          </p>
        </Card>

        {/* Active Seats Quota block */}
        <Card className="border border-border bg-card p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-500" /> Collaborator Seats
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold">
                {((user ? 1 : 0) / (subscription === 'free' ? 1 : subscription === 'pro' ? 5 : 25) * 100).toFixed(0)}%
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-foreground">
                  {user ? 1 : 0} Seat
                </span>
                <span className="text-xs text-muted-foreground font-semibold">
                  / {subscription === 'free' ? '1' : subscription === 'pro' ? '5' : '25'} ativos
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">Membros da equipe com acesso JWT</p>
            </div>

            {/* Custom tailored progress bar */}
            <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${((user ? 1 : 0) / (subscription === 'free' ? 1 : subscription === 'pro' ? 5 : 25)) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider pt-3 border-t border-border/40 mt-4">
            Nível máximo de permissões ativas
          </p>
        </Card>

      </div>

      {/* Grid containing Plan Selector Pricing Cards */}
      <div>
        <h2 className="text-base font-black uppercase tracking-wider text-foreground mb-4">Planos de Assinatura Disponíveis</h2>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = subscription === plan.id;
            return (
              <Card 
                key={plan.id}
                className={`border rounded-2xl p-6 flex flex-col justify-between transition-all relative overflow-hidden ${
                  isCurrent 
                    ? 'border-primary bg-primary/5 dark:bg-primary/2 shadow-lg scale-[1.01]' 
                    : 'border-border bg-card hover:border-border/80'
                }`}
              >
                {/* Floating active badge */}
                {isCurrent && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest leading-none">
                    <Sparkles size={8} /> Ativo
                  </span>
                )}

                <div className="space-y-5">
                  <div className="text-left space-y-1">
                    <h3 className="text-base font-black uppercase tracking-tight text-foreground">{plan.name}</h3>
                    <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Price with Cycle details */}
                  <div className="text-left">
                    <span className="text-3xl font-black text-foreground">
                      {getPlanPrice(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-xs text-muted-foreground font-bold ml-1">
                        / {billingCycle === 'monthly' ? 'mês' : 'ano'}
                      </span>
                    )}
                  </div>

                  {/* Features listing */}
                  <ul className="space-y-2.5 list-none p-0 m-0 border-t border-border/50 pt-5 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <Check size={13} className="text-emerald-500 shrink-0 stroke-[3]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Button
                    onClick={() => handleSelectPlan(plan.id as any)}
                    variant={isCurrent ? 'outline' : plan.id === 'pro' ? 'default' : 'glass'}
                    className={`w-full font-black uppercase text-[10px] tracking-wider py-2.5 cursor-pointer rounded-xl ${
                      isCurrent ? 'border-primary/35 text-primary bg-transparent hover:bg-primary/5' : ''
                    }`}
                  >
                    <span>{isCurrent ? 'Plano Ativo' : plan.cta}</span>
                    {!isCurrent && <ArrowRight size={12} className="ml-1.5 stroke-[2.5]" />}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Credit Card Setup & Receipt history row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        
        {/* Payment and Invoicing overview */}
        <Card className="lg:col-span-5 border border-border bg-card p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Informações de Cobrança</h3>
              <Shield className="h-4 w-4 text-emerald-500" />
            </div>

            {/* Credit Card Illustration */}
            <div className="bg-gradient-to-tr from-neutral-900 to-neutral-800 dark:from-neutral-950 dark:to-neutral-900 p-5 rounded-xl border border-neutral-800 shadow-inner text-white flex flex-col justify-between h-36 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">SaaS Gateway Active</span>
                <span className="text-xs font-black italic">VISA</span>
              </div>
              
              <div className="space-y-1">
                <span className="block font-mono text-sm tracking-widest text-neutral-300">•••• •••• •••• 4242</span>
                <div className="flex justify-between text-[8px] uppercase font-black tracking-widest text-neutral-400 mt-2">
                  <div>
                    <span className="block font-semibold">Titular</span>
                    <span className="text-white text-[9px]">{user?.name || 'Felix the CAT'}</span>
                  </div>
                  <div>
                    <span className="block font-semibold">Expira</span>
                    <span className="text-white text-[9px]">08/29</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-muted-foreground">Ciclo Próximo de Cobrança:</span>
                <span className="text-foreground font-black">18 Julho, 2026</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-muted-foreground">E-mail de Notificações:</span>
                <span className="text-foreground font-black truncate max-w-[150px]">{user?.email || 'contato@saas.com'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 mt-6 pt-4 border-t border-border/40">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addNotification('Redirecionando para portal do Stripe (demonstração)...', 'info')}
              className="w-full text-[10px] font-extrabold uppercase tracking-wide cursor-pointer rounded-xl h-9"
            >
              Alterar Cartão
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => addNotification('Suporte de faturamento aberto via email!', 'success')}
              className="w-full text-[10px] font-extrabold uppercase tracking-wide cursor-pointer rounded-xl h-9"
            >
              Suporte Financeiro
            </Button>
          </div>
        </Card>

        {/* Invoice List Ledger */}
        <Card className="lg:col-span-7 border border-border bg-card p-6 rounded-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Histórico de Faturas do SaaS</h3>
            <span className="text-[10px] text-muted-foreground font-bold font-mono">Invoice ledger</span>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase text-[9px] font-black tracking-widest">
                  <th className="py-2.5 px-3">Identificador</th>
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Valor</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                  <th className="py-2.5 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border/20 last:border-b-0 hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-foreground">
                      {invoice.id}
                    </td>
                    <td className="py-3 px-3 font-medium text-muted-foreground">
                      {invoice.date}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-foreground">
                      {invoice.amount}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-green-500/10 text-green-600 dark:text-green-400">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => addNotification(`Baixando recibo em PDF da fatura ${invoice.id}...`, 'success')}
                        className="p-1 text-muted-foreground hover:text-foreground cursor-pointer hover:bg-muted/60 rounded transition-colors"
                        title="Baixar PDF Recibo"
                      >
                        <Download size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </div>
  );
}

export default BillingShowcase;
