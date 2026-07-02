'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '@/lib/store';
import { useTheme } from '@/providers/theme-provider';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  ArrowUp,
  Layers, 
  Cpu, 
  Terminal, 
  Globe, 
  Database,
  Lock, 
  ChevronDown, 
  Code,
  Shield, 
  Workflow, 
  Sparkles,
  RefreshCw,
  Server,
  Check
} from 'lucide-react';

export function LandingPage() {
  const { setAuthView, login } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    // Prevent default browser scroll restoration on refresh and force scroll to top
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0 });
    
    // Set fallback backup scroll
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }

      // Check if user has scrolled down > 500px
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const features = [
    {
      icon: Layers,
      title: 'Arquitetura de Front-End Limpa',
      desc: 'Separação estruturada de responsabilidades (serviços, repositórios, hooks, stores). Totalmente modular e escalável.',
    },
    {
      icon: Database,
      title: 'Pronto para Integração Relacional',
      desc: 'Camadas de serviço com suporte para integração nativa com NestJS e PostgreSQL sem necessidade de refatoração.',
    },
    {
      icon: Terminal,
      title: 'Amigável a Conteinerização (Docker)',
      desc: 'Orquestração pronta com Dockerfile e docker-compose multi-stage otimizados para desenvolvimento e produção.',
    },
    {
      icon: Shield,
      title: 'Auditoria de Estado com Zustand',
      desc: 'Gerenciamento de estado otimizado com slices tipadas e disparos de segurança em tempo real com rastro de eventos.',
    },
    {
      icon: Code,
      title: 'Validação de Ponta a Ponta',
      desc: 'Esquemas de validação de dados construídos em Zod e acoplados a formulários controlados por React Hook Form.',
    },
    {
      icon: Workflow,
      title: 'Pipeline CI/CD Robusto',
      desc: 'Workflows configurados do GitHub Actions validando testes com Vitest, compilação de produção e linting estrito.',
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter Developer',
      price: 'R$ 0',
      period: 'grátis para sempre',
      desc: 'Perfeito para prototipagem ágil e exploração de componentes estruturais.',
      features: [
        'Acesso Completo ao Design System',
        'Zustand State Inspector Integrado',
        'Configuradores de Conectores Locais',
        'Mocks de Chaves de API para Testes',
        'Licença MIT para Uso Pessoal/Comercial'
      ],
      cta: 'Começar Grátis',
      primary: false
    },
    {
      name: 'Business Pro',
      price: 'R$ 149',
      period: '/mês no plano anual',
      desc: 'Ideal para equipes estruturando SaaS SaaS de alta escala integrados a NestJS.',
      features: [
        'Todos os recursos do plano Starter',
        'Templates de Integração NestJS & Postgres',
        'Configuração Docker Multi-Ambiente Pronta',
        'Acesso aos Workflows GitHub Actions CI/CD',
        'Suporte por E-mail em menos de 12 horas'
      ],
      cta: 'Iniciar Demonstração',
      primary: true
    },
    {
      name: 'Enterprise Scale',
      price: 'Sob Consulta',
      period: 'orçamento customizado',
      desc: 'Para corporações necessitando de conformidade rígida e infraestrutura certificada.',
      features: [
        'SLA de Disponibilidade Garantido',
        'Templates de Segurança Avançada (MFA, JWT)',
        'Integração Assistida de DevOps Avançado',
        'Aconselhamento de Arquitetura Dedicado',
        'Canal Privado no Slack com Engenheiros'
      ],
      cta: 'Falar com Especialistas',
      primary: false
    }
  ];

  const faqs = [
    {
      q: 'Este Starter Kit possui algum backend pré-configurado?',
      a: 'Não. Este é um starter kit de front-end altamente profissional focado na arquitetura do lado do cliente. Ele foi desenhado especificamente para se integrar de forma indolor com NestJS e PostgreSQL no futuro, contendo todas as interfaces, repositórios e serviços devidamente abstracionados.'
    },
    {
      q: 'Quais são as principais tecnologias do ecossistema?',
      a: 'Utilizamos Next.js 16+ com App Router, TypeScript estrito, Tailwind CSS v4 para estilização rápida, Zustand para gerenciamento de fluxo de estados global, React Hook Form acoplado a esquemas do Zod 4, e Motion para animações fluidas e sutis.'
    },
    {
      q: 'Como funciona a persistência de configurações locais?',
      a: 'As conexões e chaves de API utilizam o estado em memória integrado com Zustand. Você pode alternar em tempo real métricas de latência ou forçar erros de simulação de banco de dados para analisar o comportamento da interface frente a incidentes.'
    },
    {
      q: 'Como realizo o deploy deste kit em produção?',
      a: 'O projeto acompanha um arquivo Dockerfile otimizado para produção e configurações de workflows do GitHub Actions para garantir testes verdes. Você pode fazer o deploy em qualquer serviço compatível com containers (Cloud Run, AWS ECS, DigitalOcean, etc.).'
    }
  ];

  const handleTestSession = () => {
    // login user instantly for friction-free simulation
    login('luistavares235@gmail.com', 'Luis Tavares');
    setAuthView('landing'); // resets back to page control
  };

  return (
    <div id="landing-page-root" className="min-h-screen bg-background relative overflow-x-hidden antialiased text-left select-none text-foreground border-b border-border/20">
      
      {/* Barra de Progresso de Rolagem */}
      <div 
        id="scroll-progress-bar"
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-primary/3 blur-[140px] pointer-events-none z-0" />

      {/* Landing Navbar */}
      <header className="sticky top-0 w-full z-40 bg-background/70 backdrop-blur-md border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
              <div className="w-4 h-4 border-2 border-primary-foreground rotate-45 rounded-sm" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider text-foreground uppercase">SaaS Starter</span>
              <span className="text-[8px] text-primary font-black uppercase tracking-widest leading-none mt-0.5">FRONT-END KIT</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-wider text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-all">Recursos</a>
            <a href="#architecture" className="hover:text-foreground transition-all">Arquitetura</a>
            <a href="#pricing" className="hover:text-foreground transition-all">Preços</a>
            <a href="#faq" className="hover:text-foreground transition-all">Dúvidas</a>
          </nav>

          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-8 w-8 rounded-lg border border-border bg-card/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Alternar Tema"
            >
              <Sparkles className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setAuthView('login')}
              className="text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all px-3 py-1.5 cursor-pointer"
            >
              Entrar
            </button>
            <button 
              onClick={() => setAuthView('register')}
              className="bg-foreground text-background text-xs font-black uppercase tracking-wider h-8 px-4 rounded-lg hover:bg-foreground/80 transition-colors cursor-pointer inline-flex items-center"
            >
              Registrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center text-center">
        {/* Spacer to push content down for perfect alignment */}
        <div className="hidden md:block h-6" />

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 flex-1 flex flex-col justify-center items-center py-6"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary"
          >
            <Code className="h-3.5 w-3.5 animate-pulse" /> ESTRUTURA PRONTA PARA PRODUÇÃO
          </motion.div>

          {/* Primary Big Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl font-black tracking-tight text-foreground max-w-4xl mx-auto leading-tight md:leading-[1.1]"
          >
            Kit de Partida Front-End <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-foreground">
              Limpo, Escalável & Extensível
            </span>
          </motion.h1>

          {/* Subtitle description */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-2"
          >
            Desenvolva seu próximo SaaS com uma arquitetura de arquétipos real. Sem improvisações: código 100% tipado estruturalmente, mock services acoplados e fluxos visuais prontos para acoplamento com NestJS & PostgreSQL.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Button
              size="lg"
              onClick={() => setAuthView('register')}
              className="w-full sm:w-auto h-11 px-8 text-xs font-black uppercase tracking-wider gap-2 cursor-pointer shadow-lg hover:shadow-primary/15 transition-all duration-300"
            >
              Iniciar Nova Conta <ArrowRight className="h-4 w-4" />
            </Button>
            
            <button
              onClick={handleTestSession}
              className="w-full sm:w-auto h-11 border border-border bg-card/30 rounded-xl hover:bg-muted/40 transition-all text-xs font-black uppercase tracking-wider px-8 cursor-pointer flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Cpu className="h-4 w-4 text-primary" /> Entrar Sessão Rápida (Luis)
            </button>
          </motion.div>
        </motion.div>

        {/* Bottom Area: Metrics & Scroll Indicator */}
        <div className="w-full pb-8 pt-6">
          {/* Quick Metrics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-border/40 pt-8"
          >
            <div className="text-center">
              <div className="text-2xl font-black text-foreground">100%</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-extrabold mt-1">TypeScript Estrito</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-foreground">Next.js 16</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-extrabold mt-1">App Router Otimizado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-foreground">Zustand</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-extrabold mt-1">Gerência de Estados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-foreground">Vitest</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-extrabold mt-1">Suíte de Testes Pronta</div>
            </div>
          </motion.div>

          {/* Dynamic Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0], y: [0, 8, 8, 0] }}
            transition={{ 
              delay: 0.8,
              duration: 2.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="flex flex-col items-center justify-center mt-8 cursor-pointer"
            onClick={() => {
              const el = document.getElementById('features');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 opacity-60">Rolar para descobrir</span>
            <ChevronDown className="h-4 w-4 text-primary" />
          </motion.div>
        </div>
      </section>

      {/* Grid Features Section */}
      <section id="features" className="relative z-10 bg-muted/20 border-t border-border/60 py-24 scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3 mb-16"
          >
            <p className="text-[10px] text-primary font-black uppercase tracking-widest">FUNCIONALIDADES ARQUITETÔNICAS</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              Construído com Padrões de Grandes Equipes
            </h2>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Diga adeus a códigos rabiscados e de onboarding difícil. Nossa estrutura de arquivos incentiva a fácil reutilização de componentes em múltiplos projetos.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                  className="p-6 border border-border bg-card hover:border-primary/25 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 rounded-xl space-y-4 group"
                >
                  <div className="h-10 w-10 bg-primary/5 rounded-lg border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Realtime Architecture Interactive simulator row */}
      <section id="architecture" className="relative z-10 py-24 border-t border-border/60 max-w-7xl mx-auto px-4 md:px-8 scroll-mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-5"
          >
            <span className="text-[10px] text-primary font-black uppercase tracking-widest block">ROBUST INTERFACE DESIGN</span>
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              Camadas desacopladas que reduzem custos e repetições
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              O front-end comunica-se exclusivamente com a camada de serviços em <code>/services</code>, permitindo que você substitua requisições simuladas por chamadas de verdade em minutos sem quebrar seu design visual.
            </p>
            <div className="space-y-3.5">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shrink-0 mt-0.5">1</div>
                <div>
                  <h4 className="text-xs font-black text-foreground uppercase tracking-tight">Design System Isolado</h4>
                  <p className="text-[11px] text-muted-foreground">Experimente paletas de cores, botões de ação e modais centralizados no Showcase de Design.</p>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shrink-0 mt-0.5">2</div>
                <div>
                  <h4 className="text-xs font-black text-foreground uppercase tracking-tight">Configurações de infra em 1 clique</h4>
                  <p className="text-[11px] text-muted-foreground">Mude latências e credenciais de banco nativos e audite os resultados em tempo real do dashboard.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Graphic code preview panel client side */}
          <motion.div 
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 w-full max-w-full overflow-hidden"
          >
            <div className="border border-border/70 rounded-xl bg-card overflow-hidden shadow-lg font-mono">
              <div className="h-10 bg-muted/40 border-b border-border/60 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[9px] text-muted-foreground font-semibold">src/services/api-client.ts</span>
              </div>
              <div className="p-5 overflow-x-auto text-[10px] leading-relaxed text-muted-foreground text-left whitespace-pre font-mono">
                <span className="text-purple-400">import</span> {'{ useAppStore }'} <span className="text-purple-400">from</span> <span className="text-emerald-400">{'"@/lib/store"'}</span>;<br />
                <span className="text-purple-400 font-extrabold">export class</span> APIClient {'{'}<br />
                &nbsp;&nbsp;<span className="text-purple-400">async</span> fetchActiveProjects() {'{'}<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-zinc-500">{"// Simula chamada HTTP baseada nos parâmetros do Zustand"}</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">const</span> latency = useAppStore.getState().config.mockLatency;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">await</span> {'new Promise((res) => setTimeout(res, latency));'}<br />
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> useAppStore.getState().projects;<br />
                &nbsp;&nbsp;{'}'}<br />
                {'}'}
              </div>
              <div className="px-5 py-3 border-t border-border/40 bg-muted/25 flex items-center justify-between text-[10px] font-bold text-primary">
                <span className="flex items-center gap-1.5"><Server className="h-3.5 w-3.5" /> NESTJS COMPATÍVEL</span>
                <span className="text-muted-foreground">MODULAR E REUTILIZÁVEL</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plan section */}
      <section id="pricing" className="relative z-10 bg-muted/20 border-t border-border/60 py-24 scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3 mb-16"
          >
            <p className="text-[10px] text-primary font-black uppercase tracking-widest">INVESTIMENTO TRANSPARENTE</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              Preços Simples para Escalar
            </h2>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Licenciamento claro, sem pegadinhas nem limite de conexões. Ideal para equipes de desenvolvimento de software e consultores de tecnologia.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => {
              return (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 40, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className={`border rounded-2xl bg-card p-7 space-y-6 flex flex-col justify-between relative transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                    plan.primary 
                      ? 'border-primary ring-1 ring-primary/25 shadow-md shadow-primary/5 hover:border-primary/80 hover:shadow-primary/5' 
                      : 'border-border hover:border-primary/20 hover:shadow-black/5'
                  }`}
                >
                  {plan.primary && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-inner z-10">
                      MAIS RECOMENDADO
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-black text-primary uppercase tracking-wider">{plan.name}</h4>
                      <div className="flex items-baseline gap-1.5 mt-2">
                        <span className="text-3xl font-black text-foreground">{plan.price}</span>
                        <span className="text-[10px] text-muted-foreground font-bold">{plan.period}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-normal mt-2">{plan.desc}</p>
                    </div>

                    <ul className="space-y-3 border-t border-border/60 pt-5 list-none p-0 m-0">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2.5 text-[11px] leading-snug text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    variant={plan.primary ? 'default' : 'outline'}
                    className="w-full text-xs font-black uppercase tracking-wider mt-5 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={() => setAuthView('register')}
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section id="faq" className="relative z-10 py-24 border-t border-border/60 max-w-4xl mx-auto px-4 md:px-8 scroll-mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 mb-16"
        >
          <p className="text-[10px] text-primary font-black uppercase tracking-widest">RESPOSTAS RÁPIDAS</p>
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Perguntas Frequentes
          </h2>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Dúvidas comuns levantadas por arquitetos e engenheiros de software antes de adotar este modelo.
          </p>
        </motion.div>

        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="border border-border bg-card rounded-xl overflow-hidden shadow-sm hover:border-primary/10 transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-muted/10 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-black text-foreground uppercase tracking-tight">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-250 ${isOpen ? 'rotate-180 text-primary font-bold' : ''}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4.5 text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-3 bg-muted/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Modern Compact Footer */}
      <footer className="relative z-10 border-t border-border bg-card/45 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-3.5 h-3.5 border-2 border-primary-foreground rotate-45 rounded-sm" />
            </div>
            <span className="text-xs font-black tracking-wider text-foreground uppercase">SaaS Starter Kit</span>
          </div>

          <p className="text-[10px] text-muted-foreground font-semibold">
            © 2026 SaaS Front-end Starter Kit. Licenciado sob termos de Engenharia Corporativa.
          </p>

          <div className="flex gap-4">
            <button onClick={() => setAuthView('login')} className="text-[10px] font-black uppercase text-muted-foreground hover:text-foreground">Log In</button>
            <span className="text-border">|</span>
            <button onClick={() => setAuthView('register')} className="text-[10px] font-black uppercase text-primary hover:text-primary/80">Sign Up</button>
          </div>
        </div>
      </footer>

      {/* Botão Flutuante 'Voltar ao Topo' */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            key="back-to-top"
            id="back-to-top-btn"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-xl bg-card/85 backdrop-blur-md border border-border/80 shadow-lg text-muted-foreground hover:text-foreground hover:border-primary/40 focus:outline-none transition-all cursor-pointer group"
            title="Voltar ao Topo"
            aria-label="Voltar para o topo da página"
          >
            <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LandingPage;
