# Arquitetura

## Visao geral

O repositorio esta em transicao de um frontend starter kit validado para uma
base full stack modular. O estado atual ainda e uma aplicacao Next.js App Router
com uma rota principal, estado global em Zustand e dominios visuais em
`features/showcase`. O estado alvo e uma base com Next.js para web, NestJS para
API, PostgreSQL com Prisma, Docker, GitHub Actions e deploy primario no Railway.

Use `docs/FULL_STACK_FOUNDATION.md` como fonte central para decisoes da nova
fase.

## Stack atual

- Next.js 16 com App Router.
- React 19.
- TypeScript strict.
- Tailwind CSS v4 via `@tailwindcss/postcss`.
- Zustand para estado global client-side.
- React Hook Form + Zod para formularios.
- Motion para microanimacoes.
- Vitest + Testing Library para testes unitarios e de componentes.
- Playwright Chromium para smoke E2E frontend em 320, 375, 768, 1024, 1365 e
  1536px.
- Docker e Docker Compose para ambiente local.

## Stack alvo

- Next.js para aplicacao web.
- NestJS para API backend.
- TypeScript strict em web e API.
- PostgreSQL como banco relacional.
- Prisma como ORM, schema, client e migrations.
- Docker como unidade de empacotamento por servico.
- Railway como deploy primario.
- GitHub Actions para CI/CD.
- AWS como alternativa futura.

## Fluxo de renderizacao atual

`app/layout.tsx` define o root layout, metadata e `ThemeProvider`.

`app/page.tsx` e um Client Component que escolhe a experiencia:

1. Sem `user` no store:
   - `authView === 'landing'`: renderiza `LandingPage`.
   - Caso contrario: renderiza `AuthShowcase`.
2. Com `user` no store:
   - Renderiza `MainContent`.
   - Renderiza o conteudo da aba ativa por `currentTab`.
   - Renderiza a bottom nav mobile/tablet ate antes de `xl`.

As abas atuais sao:

- `dashboard`: `ShowcaseDashboard`.
- `projects`: `FormShowcase`.
- `billing`: `BillingShowcase`.
- `settings`: `SettingsShowcase`.

`config/navigation.ts` centraliza `APP_NAV_ITEMS`, `DEFAULT_APP_TAB` e o tipo
`AppTab`. `lib/store.ts`, `Header`, bottom nav mobile/tablet e `Sidebar`
consomem esse contrato para evitar divergencia entre labels, icones e ids de
abas.

O `Header` exibe a navegacao completa apenas a partir de `xl`; em larguras
mobile e tablet a navegacao principal fica na bottom nav. A busca compacta do
header aparece apenas em `2xl` para evitar sobreposicao entre logo, abas e
acoes de usuario. O menu do usuario contem atalhos de navegacao, ajuda e logout;
alternancia de tema fica na landing publica e na tela de settings.

`components/layouts/sidebar.tsx` existe, mas nao esta montado em `app/page.tsx`
no estado atual. Qualquer alteracao de navegacao deve decidir explicitamente se
mantem header + bottom nav ou reativa sidebar.

## Estrutura atual de pastas

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
e2e/                         Smoke tests Playwright
types/                       Tipos compartilhados de contratos
```

## Estrutura alvo de alto nivel

A separacao fisica final ainda precisa de plano especifico. A direcao aceita e:

```txt
web ou apps/web              Aplicacao Next.js
api ou apps/api              API NestJS
prisma/                      Schema, migrations e seeds
.github/workflows/           CI/CD
```

Nao mova arquivos em massa sem um plano de migracao. Enquanto a estrutura alvo
nao existir, preserve a raiz atual e documente qualquer etapa intermediaria.

## Estado global atual

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

Durante a migracao full stack, o store deve perder responsabilidade por dados
persistentes aos poucos. Estado local/client-side deve permanecer para UI
efemera, sessao de cliente quando aplicavel, filtros e notificacoes visuais.

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

## Contrato de API atual

`services/api-client.ts` define `IApiService` com:

- `getDashboardStats()`.
- `getActivityLogs()`.
- `getSystemHealth()`.
- `submitForm(data)`.

`SYSTEM_CONFIG.api.isMockEnabled` seleciona entre `mockDashboardService` e
`RealApiService`. No estado atual, mocks permanecem habilitados.

Na fase full stack, esse contrato deve servir como ponte. Antes de trocar uma
tela para API real, defina DTOs, erros e testes do dominio.

## Arquitetura alvo da API

A API NestJS deve ser organizada por dominio:

- `auth`: login, logout, sessao, guards e autorizacao.
- `users`: perfil e preferencias.
- `projects`: CRUD e regras de negocio de projetos.
- `activity`: logs/auditoria de eventos.
- `billing`: plano, uso e integracoes futuras de pagamento.
- `health`: status da API, banco e dependencias.

Padroes esperados:

- Controllers recebem HTTP e chamam services.
- Services contem regras de negocio.
- DTOs definem request/response.
- Pipes validam entrada.
- Filters padronizam erros.
- Guards protegem rotas sensiveis.
- Prisma fica atras de services/repositories, nunca diretamente no frontend.

## Persistencia alvo

PostgreSQL e o banco padrao. Prisma deve controlar schema e migrations. O banco
de producao deve ser Railway Postgres como servico separado. O banco local pode
rodar por Docker Compose.

Segredos como `DATABASE_URL` ficam apenas no servidor. Nunca expose credenciais
em `NEXT_PUBLIC_*`.

## Client e Server Components

A maior parte da UI atual usa `'use client'` por depender de Zustand,
formularios, Motion, localStorage ou eventos de browser.

Futuras telas devem empurrar `'use client'` para baixo da arvore. Leitura de
dados server-side deve usar Server Components quando isso simplificar a pagina e
nao exigir estado de browser. Mutacoes internas podem usar APIs ou Server
Actions apenas quando a arquitetura aprovada permitir.

## Deploy alvo

Railway e o alvo primario. A direcao e:

- Servicos separados para aplicacao/API quando a separacao existir.
- Railway Postgres como banco gerenciado.
- Dockerfile ou build config por servico.
- Healthchecks.
- Pre-deploy migrations Prisma.
- GitHub Actions com lint, typecheck, testes, build e deploy quando habilitado.

Para Next.js self-hosted/Docker, consulte a doc local de deploy e `output` antes
de alterar `next.config.ts`. A doc local de Next indica que Docker suporta todos
os recursos e que `output: "standalone"` cria um runtime minimo para deploy.

## Testes atuais

`vitest.config.ts` usa:

- `@vitejs/plugin-react`.
- Alias `@` apontando para a raiz.
- Ambiente `jsdom`.
- Setup em `tests/setup.ts`.

Testes existentes cobrem componentes base, tema, store, auth, projetos,
settings, billing, layout, modais/dialogs e acessibilidade dos fluxos principais.

`playwright.config.ts` define smoke E2E Chromium-only em `e2e/`, com projetos
explicitos para 320, 375, 768, 1024, 1365 e 1536px. O teste cobre landing,
tema, login mock, navegacao, formulario de projetos, billing, settings,
ausencia de overflow horizontal e foco visivel.

## Testes alvo

Quando API e banco existirem, acrescente:

- Testes unitarios de services NestJS.
- Testes de controllers/rotas.
- Testes de contrato DTO/request/response.
- Testes de migrations/seeds quando aplicavel.
- Testes de integracao com banco em ambiente controlado.
- Smoke de container e healthcheck para deploy.

## Acessibilidade aplicada

Componentes de overlay devem expor `role="dialog"`, `aria-modal`, nome e
descricao acessiveis. Botoes icon-only devem usar `aria-label`; `title` sozinho
nao deve ser usado como nome acessivel.

Campos customizados de formulario devem conectar erros com `aria-invalid` e
`aria-describedby`, incluindo `textarea`, `checkbox`, `select` e inputs que nao
passam pelo componente base `Input`.

## Limites conhecidos

- A aplicacao atual usa uma rota principal com navegacao por abas, nao rotas
  aninhadas.
- `Sidebar` esta disponivel, mas nao montada.
- Auth, projetos, API keys, assinatura, logs e infraestrutura ainda sao
  simulados.
- Docker Compose inclui PostgreSQL local, mas o frontend nao persiste dados
  nele.
- NestJS, Prisma, migrations, GitHub Actions e deploy Railway ainda nao estao
  implementados.
- `next-env.d.ts` e gerado pelo Next, ignorado pelo Git e nao deve ser editado
  manualmente.
