# Arquitetura

## Visao geral

Este repositorio é um frontend starter kit em Next.js App Router. A aplicacao
atual e uma experiencia SaaS demonstrativa com uma rota principal, estado global
em Zustand e dominios visuais separados em `features/showcase`.

O objetivo arquitetural nesta fase é validar o frontend e manter pontos claros
para substituir mocks por backend real no futuro.

## Stack

- Next.js 16 com App Router.
- React 19.
- TypeScript strict.
- Tailwind CSS v4 via `@tailwindcss/postcss`.
- Zustand para estado global client-side.
- React Hook Form + Zod para formularios.
- Motion para microanimacoes.
- Vitest + Testing Library para testes.
- Docker e Docker Compose para ambiente local.

## Fluxo de renderizacao

`app/layout.tsx` define o root layout, metadata e `ThemeProvider`.

`app/page.tsx` e um Client Component que escolhe a experiencia:

1. Sem `user` no store:
   - `authView === 'landing'`: renderiza `LandingPage`.
   - Caso contrario: renderiza `AuthShowcase`.
2. Com `user` no store:
   - Renderiza `MainContent`.
   - Renderiza o conteudo da aba ativa por `currentTab`.
   - Renderiza a bottom nav mobile.

As abas atuais sao:

- `dashboard`: `ShowcaseDashboard`.
- `projects`: `FormShowcase`.
- `billing`: `BillingShowcase`.
- `settings`: `SettingsShowcase`.

`components/layouts/sidebar.tsx` existe, mas nao esta montado em `app/page.tsx`
no estado atual. Qualquer agente que for alterar navegacao deve decidir
explicitamente se vai manter o modelo atual baseado em header + bottom nav ou
reativar a sidebar.

## Estrutura de pastas

```txt
app/                         Root layout, pagina principal e CSS global
components/animations/       Presets reutilizaveis de Motion
components/layouts/          Header, main content e sidebar disponivel
components/ui/               Componentes base reutilizaveis
config/                      Configuracao central da aplicacao
features/showcase/           Experiencias demonstrativas por dominio
hooks/                       Hooks globais
lib/                         Store Zustand e utilitarios
providers/                   Providers globais
services/                    Contrato de API e mock service
tests/                       Testes Vitest e setup
types/                       Tipos compartilhados de contratos
```

## Estado global

`lib/store.ts` concentra os slices atuais:

- Sidebar e navegacao: abertura, colapso, aba ativa e drawer de notificacoes.
- Notificacoes: lista, adicionar, remover e limpar.
- Auth mock: `user`, `authView`, `login`, `logout`, `updateProfile`.
- Config mock: endpoint API, host/porta/user de DB, latencia e falha simulada.
- Projetos: lista mockada, criacao e remocao.
- API keys: lista mockada, geracao e revogacao.
- Logs: eventos recentes e novos logs.
- Assinatura: plano atual e uso simulado.

Enquanto o projeto estiver em validacao frontend, e aceitavel manter a
orquestracao no store. Ao iniciar backend real, preserve contratos e migre por
fatias para evitar quebrar os fluxos visuais.

## Contrato de API

`services/api-client.ts` define `IApiService` com:

- `getDashboardStats()`.
- `getActivityLogs()`.
- `getSystemHealth()`.
- `submitForm(data)`.

`SYSTEM_CONFIG.api.isMockEnabled` seleciona entre `mockDashboardService` e
`RealApiService`. No estado atual, mocks permanecem habilitados.

## Client Components

A maior parte da UI atual usa `'use client'` por depender de estado local,
Zustand, formularios, Motion, localStorage ou eventos de browser.

Antes de introduzir Server Components ou Route Handlers, confirme que a tarefa
pertence a fase atual. Backend real e rotas API nao devem ser adicionados sem
pedido explicito.

## Testes

`vitest.config.ts` usa:

- `@vitejs/plugin-react`.
- Alias `@` apontando para a raiz.
- Ambiente `jsdom`.
- Setup em `tests/setup.ts`.

Testes existentes cobrem:

- `Button`.
- `useTheme` dentro do `ThemeProvider`.
- `cn` em `lib/utils.ts`.
- `useAppStore` nos fluxos mockados de auth, perfil, projetos, notificacoes,
  configuracao, API keys, assinatura e uso.
- `Modal` e `Dialog` com semantica acessivel de dialogo.
- Formularios criticos de auth, projetos e settings.

Novas regras de negocio no store, formularios ou contratos devem receber teste
focado quando alterarem comportamento.

## Acessibilidade aplicada

Componentes de overlay devem expor `role="dialog"`, `aria-modal`, nome e
descricao acessiveis. Botoes icon-only devem usar `aria-label`; `title` sozinho
nao deve ser usado como nome acessivel de controle interativo.

Campos customizados de formulario devem conectar erros com `aria-invalid` e
`aria-describedby`, incluindo `textarea`, `checkbox`, `select` e inputs que nao
passam pelo componente base `Input`.

## Limites conhecidos

- A aplicacao usa uma rota principal com navegacao por abas, nao rotas aninhadas.
- `Sidebar` esta disponivel, mas nao montada.
- Auth, projetos, API keys, assinatura, logs e infraestrutura sao simulados.
- Docker Compose inclui PostgreSQL local, mas o frontend nao persiste dados nele.
- Nao existe CI versionado em `.github` no estado atual.
- `next-env.d.ts` e gerado pelo Next, ignorado pelo Git e nao deve ser editado
  manualmente.
