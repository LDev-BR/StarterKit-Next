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
- Vitest + Testing Library para testes unitarios e de componentes.
- Playwright Chromium para smoke E2E frontend em desktop, tablet e mobile.
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

`config/navigation.ts` centraliza `APP_NAV_ITEMS`, `DEFAULT_APP_TAB` e o tipo
`AppTab`. `lib/store.ts`, `Header`, bottom nav mobile e `Sidebar` consomem esse
contrato para evitar divergencia entre labels, icones e ids de abas.

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
e2e/                         Smoke tests Playwright da validacao frontend
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

`currentTab` e `setCurrentTab` sao tipados com `AppTab`. Novas abas devem ser
adicionadas primeiro em `config/navigation.ts` e depois integradas ao switch de
conteudo em `app/page.tsx`.

Enquanto o projeto estiver em validacao frontend, e aceitavel manter a
orquestracao no store. Ao iniciar backend real, preserve contratos e migre por
fatias para evitar quebrar os fluxos visuais.

## UI reutilizavel

`components/ui` contem os primitivos do starter kit. Alem de `Button`, `Card`,
`Input`, overlays e estados, as telas SaaS usam:

- `PageHeader` para cabecalhos consistentes de pagina.
- `SegmentedControl` para filtros ou modos mutuamente exclusivos.
- `MetricCard` para indicadores com progresso acessivel.
- `ResponsiveDataView` para listas que viram tabela em desktop e cards em
  mobile.

Dashboard, projects, billing e settings devem preferir esses componentes antes
de criar controles locais equivalentes.

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
- Semantica acessivel do header, drawer mobile, controles segmentados do
  dashboard e medidores de billing.

`playwright.config.ts` define smoke E2E Chromium-only em `e2e/`, com projetos
explicitos para 320, 375, 768, 1024, 1365 e 1536px. O teste cobre landing,
tema, login mock, navegacao para projetos/billing/settings, validacao basica de
formulario, billing mockado, ausencia de overflow horizontal e foco visivel em
controles principais. Ele nao cria backend real nem persistencia.

`scripts/run-playwright-e2e.mjs` e o ponto de entrada de `pnpm run test:e2e`.
Ele inicia o dev server quando necessario, reutiliza `localhost:3000` se ja
houver servidor ativo, desativa o `webServer` gerenciado pelo Playwright via
`PLAYWRIGHT_MANAGE_WEB_SERVER=0` e encerra apenas o servidor que ele iniciou.

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
