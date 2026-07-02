'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SlideIn } from '@/components/animations/motion-presets';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Trash2, 
  Mail, 
  Info, 
  DollarSign, 
  CheckCircle,
  X,
  Filter
} from 'lucide-react';

// Strict Zod schema for project registration
const projectFormSchema = z.object({
  projectName: z
    .string()
    .min(3, { message: 'O nome do projeto deve possuir no mínimo 3 caracteres.' })
    .max(50, { message: 'Limite máximo de 50 caracteres excedido.' }),
  projectDescription: z
    .string()
    .min(10, { message: 'Escreva uma breve descrição de pelo menos 10 caracteres.' })
    .max(300, { message: 'Limite máximo de 300 caracteres excedido.' }),
  contactEmail: z
    .string()
    .email({ message: 'Insira um e-mail de contato corporativo válido.' }),
  billingPlan: z.enum(['startup', 'enterprise', 'custom'], {
    error: 'Selecione um plano comercial valido.',
  }),
  allocatedBudget: z.coerce
    .number()
    .min(500, { message: 'O orçamento mínimo alocado é de $500 USD.' }),
  acceptTerms: z.boolean().refine((value) => value, {
    message: 'Voce deve concordar com as regras de conformidade corporativa.',
  }),
});

type ProjectFormInput = z.input<typeof projectFormSchema>;
type ProjectFormData = z.output<typeof projectFormSchema>;

export function FormShowcase() {
  const { projects, addProject, removeProject, addNotification, config } = useAppStore();
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormInput, unknown, ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      projectName: '',
      projectDescription: '',
      contactEmail: '',
      billingPlan: 'startup',
      allocatedBudget: 1000,
      acceptTerms: false,
    },
  });

  // Action hook to handle project registration
  const onSubmitProject = async (data: ProjectFormData) => {
    setSubmitting(true);
    // Simulate database write latency
    setTimeout(() => {
      try {
        const { acceptTerms, ...rest } = data; // skip acceptTerms for internal db structure
        const registered = addProject(rest);
        addNotification(`Projeto "${registered.projectName}" cadastrado e ativado no cluster!`, 'success');
        reset();
        setShowAddForm(false);
      } catch (err) {
        console.error(err);
        addNotification('Falha ao registrar projeto no banco.', 'error');
      } finally {
        setSubmitting(false);
      }
    }, Math.max(config.mockLatency, 500));
  };

  // Filter projects dynamically
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = 
        project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.projectDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPlan = planFilter === 'all' || project.billingPlan === planFilter;
      
      return matchesSearch && matchesPlan;
    });
  }, [projects, searchQuery, planFilter]);

  const handleDelete = (id: string, name: string) => {
    removeProject(id);
    addNotification(`Projeto "${name}" foi revogado e removido do cluster.`, 'warning');
  };

  // Style helper for badges
  const getPlanBadge = (plan: 'startup' | 'enterprise' | 'custom') => {
    switch (plan) {
      case 'startup':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'enterprise':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'custom':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div id="project-manager-container" className="space-y-6 text-left">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
            Gerenciamento de Projetos
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 max-w-2xl">
            Painel corporativo para pesquisar, filiar, analisar orçamentos e provisionar novos ambientes de software.
          </p>
        </div>
        
        {!showAddForm && (
          <Button
            id="btn-open-project-form"
            variant="default"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="gap-2 cursor-pointer font-bold"
          >
            <Plus className="h-4 w-4" /> Provisionar Projeto
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main interactive column */}
        <div className={showAddForm ? "lg:col-span-7 space-y-6" : "lg:col-span-12 space-y-6"}>
          {/* Filters & Actions Panel */}
          <Card id="project-filter-card" className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
              <div className="relative flex-1">
                <span className="absolute left-3 top-3 text-muted-foreground">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="Pesquisar por nome, descrição ou e-mail..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background border border-border rounded-lg h-10 w-full pl-9 pr-4 text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="bg-background border border-border rounded-lg h-10 px-3 text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="all">Filtro: Todos Planos</option>
                  <option value="startup">Startup Core</option>
                  <option value="enterprise">Enterprise Scaled</option>
                  <option value="custom">Custom Platinum</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Active Projects List */}
          <div className="space-y-4">
            {filteredProjects.length === 0 ? (
              <Card id="empty-projects-card" className="p-12 text-center flex flex-col items-center justify-center border-dashed">
                <FolderKanban className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-sm font-bold text-foreground">Nenhum projeto localizado</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Crie um novo projeto usando o formulário de provisionamento para que seja listado no cluster local.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                {filteredProjects.map((project) => (
                  <SlideIn key={project.id} direction="up">
                    <Card id={`project-card-${project.id}`} isHoverable className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1.5 flex-1 pr-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-sm text-foreground uppercase tracking-tight">
                            {project.projectName}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase ${getPlanBadge(project.billingPlan)}`}>
                            {project.billingPlan}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {project.projectDescription}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-semibold">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground/75" />
                            {project.contactEmail}
                          </span>
                          <span className="flex items-center gap-0.5 text-foreground font-bold">
                            <DollarSign className="h-3 w-3 text-emerald-500" />
                            {project.allocatedBudget.toLocaleString('pt-BR')} USD
                          </span>
                        </div>
                      </div>

                      <div className="w-full md:w-auto flex justify-end shrink-0 border-t md:border-t-0 border-border/40 pt-3 md:pt-0">
                        <Button
                          id={`btn-delete-${project.id}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project.id, project.projectName)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  </SlideIn>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Provisioning Form Column */}
        {showAddForm && (
          <SlideIn direction="left" className="lg:col-span-5 bg-card border border-border rounded-xl shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex justify-between items-center bg-muted/20">
              <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-primary" /> Provisionar Ambiente
              </span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitProject)} className="p-5 space-y-4">
              <div className="space-y-1">
                <Input
                  label="Nome do Projeto SaaS"
                  placeholder="Ex: Control Center Pro"
                  error={errors.projectName?.message}
                  {...register('projectName')}
                />
              </div>

              <div className="space-y-1">
                <Input
                  label="E-mail Corporativo"
                  placeholder="email@corporativo.com"
                  type="email"
                  error={errors.contactEmail?.message}
                  {...register('contactEmail')}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="projectDescription" className="text-xs font-black uppercase tracking-wider text-muted-foreground select-none">
                  Objetivos & Escala
                </label>
                <textarea
                  id="projectDescription"
                  placeholder="Especifique as metas de escala para o Kubernetes..."
                  rows={3}
                  className={`flex w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all ${
                    errors.projectDescription ? 'border-red-500' : ''
                  }`}
                  {...register('projectDescription')}
                />
                {errors.projectDescription && (
                  <span className="text-[10px] text-red-500 font-semibold">{errors.projectDescription.message}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="billingPlan" className="text-xs font-black uppercase tracking-wider text-muted-foreground select-none">
                    Contrato
                  </label>
                  <select
                    id="billingPlan"
                    className="flex h-10 w-full rounded-lg border border-border bg-background px-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer"
                    {...register('billingPlan')}
                  >
                    <option value="startup">Startup Core</option>
                    <option value="enterprise">Enterprise Scaled</option>
                    <option value="custom">Custom Platinum</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Input
                    label="Orçamento USD"
                    type="number"
                    placeholder="Min 500"
                    error={errors.allocatedBudget?.message}
                    {...register('allocatedBudget')}
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  className="mt-0.5 cursor-pointer h-4 w-4 accent-primary rounded border-border"
                  {...register('acceptTerms')}
                />
                <div className="flex-1">
                  <label htmlFor="acceptTerms" className="text-[10px] text-muted-foreground tracking-tight leading-relaxed select-none cursor-pointer font-semibold block">
                    Concordo com os padrões de governança, conformidade interna de rede local e auditoria.
                  </label>
                  {errors.acceptTerms && (
                    <span className="text-[10px] text-red-500 font-semibold block mt-0.5">{errors.acceptTerms.message}</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-end gap-2 text-right">
                <Button
                  id="btn-form-cancel"
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    reset();
                    setShowAddForm(false);
                  }}
                  className="font-bold"
                >
                  Voltar
                </Button>
                <Button
                  id="btn-form-submit"
                  type="submit"
                  size="sm"
                  variant="default"
                  className="font-bold"
                  isLoading={submitting}
                >
                  Gravar Projeto
                </Button>
              </div>
            </form>
          </SlideIn>
        )}
      </div>

      {/* Underlay Info for Real Backend */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 flex gap-4">
        <Info className="h-6 w-6 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase text-foreground">Conectores de Persistência PostgreSQL</h4>
          <p className="text-xs text-muted-foreground leading-relaxed leading-medium">
            Toda a lógica interativa acima está ligada aos repositórios unificados em memória. Para transformá-lo em gravação permanente, insira o Drizzle ORM ou TypeORM no NestJS, mapeando as rotas <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground font-semibold">/api/projects</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FormShowcase;
