'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/ui/metric-card';
import { PageHeader } from '@/components/ui/page-header';
import { ResponsiveDataView, type DataColumn } from '@/components/ui/responsive-data-view';
import { SegmentedControl } from '@/components/ui/segmented-control';
import {
  CreditCard,
  Check, 
  ArrowRight, 
  Download, 
  Shield, 
  Cpu, 
  Database,
  Users,
  Sparkles
} from 'lucide-react';

const clampProgressValue = (value: number) => Math.min(Math.max(Math.round(value), 0), 100);

type BillingCycle = 'monthly' | 'annually';

interface InvoiceRow {
  id: string;
  date: string;
  amount: string;
  status: string;
}

const billingCycleItems = [
  { value: 'monthly', label: 'Mensal' },
  { value: 'annually', label: 'Anual -20%' },
] as const;

export function BillingShowcase() {
  const { 
    subscription, 
    setSubscription, 
    addNotification, 
    apiUsage, 
    dbUsage,
    user
  } = useAppStore();

  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  type PlanId = 'free' | 'pro' | 'enterprise';

  interface BillingPlan {
    id: PlanId;
    name: string;
    price: number;
    description: string;
    features: string[];
    cta: string;
  }

  const plans: BillingPlan[] = [
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
      cta: 'Plano Atual'
    },
    {
      id: 'pro',
      name: 'Pro Developer',
      price: 10,
      description: 'Ideal para projetos em crescimento e integração contínua.',
      features: [
        'Cotas simuladas para cenários PostgreSQL',
        'Até 100.000 requisições/mês',
        'Chaves de API ilimitadas',
        'Cenários visuais de replicação em containers',
        'Suporte prioritário 24/7'
      ],
      cta: 'Upgrade para Pro'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      description: 'Desempenho máximo e isolamento completo para sua corporação.',
      features: [
        'Cenário enterprise dedicado em mock',
        'Indicadores visuais de SLA para demonstração',
        'Controle demonstrativo de sessão JWT',
        'Simulação de backup recorrente',
        'Gerente de conta exclusivo'
      ],
      cta: 'Contatar Vendas'
    }
  ];

  const invoices: InvoiceRow[] = [
    { id: 'INV-2026-004', date: '18 Jun, 2026', amount: subscription === 'enterprise' ? '$99.00' : subscription === 'pro' ? '$10.00' : '$0.00', status: 'Pago' },
    { id: 'INV-2026-003', date: '18 Mai, 2026', amount: subscription === 'enterprise' ? '$99.00' : subscription === 'pro' ? '$10.00' : '$0.00', status: 'Pago' },
    { id: 'INV-2026-002', date: '18 Abr, 2026', amount: '$0.00', status: 'Pago' },
    { id: 'INV-2026-001', date: '18 Mar, 2026', amount: '$0.00', status: 'Pago' },
  ];

  const handleSelectPlan = (tier: PlanId) => {
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

  const apiLimit = subscription === 'free' ? 10000 : subscription === 'pro' ? 100000 : 1000000;
  const apiLimitLabel = subscription === 'free' ? '10k' : subscription === 'pro' ? '100k' : '1 mi';
  const apiUsagePercent = (apiUsage / apiLimit) * 100;
  const apiProgressValue = clampProgressValue(apiUsagePercent);
  const dbLimit = subscription === 'free' ? 1 : subscription === 'pro' ? 10 : 100;
  const dbUsagePercent = (dbUsage / dbLimit) * 100;
  const dbProgressValue = clampProgressValue(dbUsagePercent);
  const activeSeats = user ? 1 : 0;
  const seatsLimit = subscription === 'free' ? 1 : subscription === 'pro' ? 5 : 25;
  const seatsUsagePercent = (activeSeats / seatsLimit) * 100;
  const seatsProgressValue = clampProgressValue(seatsUsagePercent);
  const invoiceColumns: DataColumn<InvoiceRow>[] = [
    {
      key: 'id',
      header: 'Identificador',
      render: (invoice) => <span className="break-anywhere font-bold text-foreground">{invoice.id}</span>,
    },
    {
      key: 'date',
      header: 'Data',
      render: (invoice) => <span className="font-medium text-muted-foreground">{invoice.date}</span>,
    },
    {
      key: 'amount',
      header: 'Valor',
      render: (invoice) => <span className="font-mono font-bold text-foreground">{invoice.amount}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'right',
      render: (invoice) => (
        <span className="inline-flex w-fit rounded bg-green-500/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-green-600 dark:text-green-400">
          {invoice.status}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Acao',
      align: 'right',
      render: (invoice) => (
        <button
          type="button"
          onClick={() => addNotification(`Baixando recibo em PDF da fatura ${invoice.id}...`, 'success')}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`Baixar recibo da fatura ${invoice.id}`}
        >
          <Download size={13} />
        </button>
      ),
    },
  ];

  return (
    <div id="saas-billing-container" className="flex flex-col gap-8 w-full text-left">
      <PageHeader
        icon={CreditCard}
        title="Assinatura & Faturamento"
        description="Gerencie o ciclo de cobranca do seu SaaS, acompanhe o limite de uso das cotas de recursos e melhore sua infraestrutura."
        actions={(
          <SegmentedControl<BillingCycle>
            items={billingCycleItems}
            value={billingCycle}
            onValueChange={setBillingCycle}
            ariaLabel="Ciclo de cobranca"
            size="sm"
            className="bg-neutral-100/60 dark:bg-neutral-800/30"
          />
        )}
      />


      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <MetricCard
          label="Volume de API requests"
          value={`${apiUsage.toLocaleString('pt-BR')} / ${apiLimitLabel} reqs`}
          description="Consumo estimado do mes corrente"
          icon={Cpu}
          tone="info"
          progress={{
            value: apiProgressValue,
            label: 'Uso de API requests',
            valueText: `${apiUsage} de ${apiLimit} requisicoes mensais`,
          }}
          footer="Ciclo reinicia em 12 dias"
          className="rounded-2xl"
        />
        <MetricCard
          label="Storage simulado"
          value={`${dbUsage.toFixed(1)} GB / ${dbLimit} GB`}
          description="Tamanho demonstrativo dos dados do starter kit"
          icon={Database}
          tone="neutral"
          progress={{
            value: dbProgressValue,
            label: 'Uso de storage simulado',
            valueText: `${dbUsage.toFixed(1)} de ${dbLimit} GB`,
          }}
          footer="Replicacao visual em modo mock"
          className="rounded-2xl"
        />
        <MetricCard
          label="Assentos ativos"
          value={`${activeSeats} ${activeSeats === 1 ? 'assento' : 'assentos'} / ${seatsLimit} ativos`}
          description="Membros da equipe com sessao mockada"
          icon={Users}
          tone="success"
          progress={{
            value: seatsProgressValue,
            label: 'Uso de assentos ativos',
            valueText: `${activeSeats} de ${seatsLimit} assentos ativos`,
          }}
          footer="Nivel maximo de permissoes ativas"
          className="rounded-2xl"
        />
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
                    onClick={() => handleSelectPlan(plan.id)}
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
                <span className="text-white text-[9px]">{user?.name || 'Admin Starter'}</span>
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
              onClick={() => addNotification('Abrindo portal de cobrança mockado para demonstração...', 'info')}
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

          <ResponsiveDataView<InvoiceRow>
            rows={invoices}
            columns={invoiceColumns}
            getRowKey={(invoice) => invoice.id}
            ariaLabel="Historico de faturas do SaaS"
            emptyState={{
              title: 'Nenhuma fatura encontrada',
              description: 'As faturas geradas pelo ciclo de assinatura aparecem neste ledger.',
            }}
            tableClassName="text-xs"
            renderMobileCard={(invoice) => (
              <article className="rounded-xl border border-border/70 bg-muted/20 p-4">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="break-anywhere text-sm font-black text-foreground">{invoice.id}</h4>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">{invoice.date}</p>
                  </div>
                  <span className="shrink-0 font-mono text-sm font-bold text-foreground">{invoice.amount}</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="inline-flex w-fit rounded bg-green-500/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-green-600 dark:text-green-400">
                    {invoice.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => addNotification(`Baixando recibo em PDF da fatura ${invoice.id}...`, 'success')}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={`Baixar recibo da fatura ${invoice.id}`}
                  >
                    <Download size={13} />
                  </button>
                </div>
              </article>
            )}
          />

        </Card>

      </div>
    </div>
  );
}

export default BillingShowcase;
