'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton, CardSkeleton, TableRowSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Dialog } from '@/components/ui/dialog';
import { Modal } from '@/components/ui/modal';
import { useAppStore } from '@/lib/store';
import { Search, Mail, ShieldAlert, Laptop, Eye, HelpCircle, Layers } from 'lucide-react';

export function ComponentsGuide() {
  const { addNotification } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  return (
    <div className="flex flex-col gap-8 w-full text-left">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Layers className="h-6 w-6 text-primary" />
          Guia de Componentes Atômicos
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Biblioteca visual dos blocos de construção integrados ao starter kit, estilizados com variáveis de tema e padrões acessíveis.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Buttons section */}
        <Card id="components-buttons">
          <CardHeader>
            <CardTitle>Botões (Button)</CardTitle>
            <CardDescription>Variantes visuais suportando microinterações e transições Framer Motion.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="default" onClick={() => addNotification('Botão Primário clicado', 'info')}>
              Default / Primário
            </Button>
            <Button variant="outline" onClick={() => addNotification('Botão Outline clicado', 'info')}>
              Outline
            </Button>
            <Button variant="secondary" onClick={() => addNotification('Botão Secundário clicado', 'info')}>
              Secondary
            </Button>
            <Button variant="ghost" onClick={() => addNotification('Botão Ghost clicado', 'info')}>
              Ghost
            </Button>
            <Button variant="glass" onClick={() => addNotification('Botão Glass clicado', 'info')}>
              Glassmorphism
            </Button>
            <Button variant="default" isLoading>
              Carregando
            </Button>
          </CardContent>
          <CardFooter className="text-[11px] text-muted-foreground">
            Classes geradas sob demanda com Class Variance Authority (CVA) em <code>/components/ui/button.tsx</code>.
          </CardFooter>
        </Card>

        {/* Inputs section */}
        <Card id="components-inputs">
          <CardHeader>
            <CardTitle>Campos de Entrada (Input)</CardTitle>
            <CardDescription>Suportando estados normais, ícones herdados e erros de schema.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Nome de Usuário"
              placeholder="Digite o nickname"
              helperText="Insira o nome de uso único do gateway"
            />
            <Input
              label="E-mail Administrativo"
              placeholder="seuemail@empresa.com"
              icon={<Mail className="h-4 w-4" />}
            />
            <Input
              label="Chave API Secreta"
              placeholder="Chave inválida"
              error="API Key expirada ou inválida na infraestrutura."
              icon={<ShieldAlert className="h-4 w-4" />}
            />
          </CardContent>
        </Card>

        {/* Skeletons & Spinners */}
        <Card id="components-loaders">
          <CardHeader>
            <CardTitle>Carregamentos & Placeholders</CardTitle>
            <CardDescription>Elementos para mitigar o desvio de layout (Layout Shift) durante carregamentos assíncronos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4 items-center">
              <span className="text-xs font-semibold text-muted-foreground mr-1">Spinners de tamanho:</span>
              <Spinner size="sm" className="p-0" />
              <Spinner size="md" className="p-0" />
              <Spinner size="lg" className="p-0" />
            </div>

            <div className="space-y-2 text-left">
              <span className="text-xs font-semibold text-muted-foreground block mb-2">Skeleton genérico animado:</span>
              <div className="flex gap-4 items-center mb-2">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-1/2" />
                  <Skeleton className="h-2.5 w-1/3" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overlays / Popups */}
        <Card id="components-popups">
          <CardHeader>
            <CardTitle>Caixas Vazadas & Modais (Overlays)</CardTitle>
            <CardDescription>Diálogos de confirmação de alto nível e overlays modais genéricos.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4 justify-start">
            <Button variant="outline" className="gap-2" onClick={() => setModalOpen(true)}>
              <Eye className="h-4 w-4" />
              Abrir Modal Comum
            </Button>
            <Button variant="default" className="gap-2" onClick={() => setDialogOpen(true)}>
              <HelpCircle className="h-4 w-4" />
              Chamar Dialog
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Empty State */}
        <div className="text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Fallback: Sem Registros (Empty State)</p>
          <EmptyState
            title="Nenhum microsserviço associado"
            description="Destaque a experiência do desenvolvedor sugerindo regras de onboarding quando tabelas SQL estiverem vazias."
            actionText="Acoplar Serviço"
            onAction={() => addNotification('Redirecionando para acoplamento fictício...', 'info')}
          />
        </div>

        {/* Error State */}
        <div className="text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Fallback: Falhas e Quedas (Error State)</p>
          <ErrorState
            title="Conexão mock expirada"
            message="O estado simulado de infraestrutura foi degradado para validar a experiência de erro do frontend."
            onRetry={() => addNotification('Buscando reconexão fictícia...', 'info')}
          />
        </div>
      </div>

      {/* Modal Element */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Visualizador de Componente Modal"
        description="Este container de overlay comum suporta o preenchimento de formulários inteiros ou dashboards secundários."
      >
        <div className="space-y-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            O componente Modal escuta automaticamente teclas físicas de <code>Esc</code> e desabilita o scroll do documento ao fundo para garantir a acessibilidade WCAG.
          </p>
          <div className="flex justify-end gap-2 text-right">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Fechar Janela
            </Button>
          </div>
        </div>
      </Modal>

      {/* Dialog Confirmation Element */}
      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={() => {
          setLoadingAction(true);
          setTimeout(() => {
            setLoadingAction(false);
            setDialogOpen(false);
            addNotification('Ação destrutiva fictícia concluída', 'success');
          }, 1000);
        }}
        title="Deseja expurgar caches compilados?"
        description="Esta ação removerá todos os chunks compilados do diretório temporário local, gerando novas solicitações de varredura."
        confirmText="Confirmar Expurgar"
        cancelText="Desistir"
        type="danger"
        isConfirmLoading={loadingAction}
      />
    </div>
  );
}
export default ComponentsGuide;
