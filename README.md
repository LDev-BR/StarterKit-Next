# StarterKit Next

Starter kit em evolucao para uma aplicacao full stack modular com Next.js,
NestJS, TypeScript, PostgreSQL, Prisma, Docker, GitHub Actions e deploy primario
no Railway.

O estado atual do repositorio ainda e uma experiencia SaaS frontend validada em
Next.js: landing, autenticacao simulada, dashboard, projetos, assinatura,
configuracoes, componentes de UI, tema claro/escuro, mocks, Vitest e Playwright.
A camada visual premium foi preservada: glassmorphism, microanimacoes e layout
responsivo.

A nova fase e Full Stack Foundation: manter o frontend validado funcionando
enquanto backend, banco, Prisma, Docker, CI/CD e deploy entram por fases.

## Stack atual

- Next.js 16 com App Router
- React 19
- TypeScript em modo strict
- Tailwind CSS v4 via `@tailwindcss/postcss`
- Zustand para estado global mockado
- React Hook Form + Zod para formularios
- Motion para animacoes
- Vitest + Testing Library para testes unitarios e de componentes
- Playwright Chromium para smoke E2E nos viewports 320, 375, 768, 1024,
  1365 e 1536px
- Docker Compose com frontend e PostgreSQL local ainda nao integrado ao app

## Stack alvo

- Next.js para a aplicacao web
- NestJS para a API backend
- TypeScript strict em todas as camadas
- PostgreSQL como banco relacional
- Prisma como ORM, schema e migrations
- Docker como unidade de empacotamento
- GitHub Actions para CI/CD
- Railway como alvo primario de deploy
- AWS como alternativa futura

Supabase nao e dependencia padrao. Pode ser reavaliado apenas se houver
necessidade clara de Auth, Storage, Realtime ou painel gerenciado.

## Estrutura atual

```txt
app/                         Rotas, layout e CSS global do Next.js
components/
  animations/                Presets reutilizaveis de Motion
  layouts/                   Header, sidebar e shell principal
  ui/                        Componentes visuais reutilizaveis
config/                      Configuracoes da aplicacao
features/showcase/
  auth/                      Fluxo de login/registro simulado
  billing/                   Assinatura e uso
  components/                Guia dos componentes internos
  dashboard/                 Dashboard operacional
  landing/                   Tela inicial publica
  projects/                  Cadastro e listagem de projetos
  settings/                  Perfil, tema e configuracoes
hooks/                       Hooks globais
lib/                         Store Zustand e utilitarios
providers/                   Providers de aplicacao
services/                    Contratos e mock de API
tests/                       Testes unitarios e setup do Vitest
e2e/                         Smoke tests Playwright
types/                       Tipos compartilhados
```

Estrutura alvo futura, a definir em plano proprio:

```txt
web ou apps/web              Aplicacao Next.js
api ou apps/api              API NestJS
prisma/                      Schema, migrations e seeds
.github/workflows/           CI/CD
```

## Desenvolvimento

Instale as dependencias:

```bash
pnpm install
```

Rode o servidor local:

```bash
pnpm run dev
```

No Windows, se o PowerShell bloquear o shim do pnpm, use:

```bash
pnpm.cmd run dev
```

## Validacao

```bash
pnpm run lint
pnpm run lint:types
pnpm test
pnpm run build
pnpm exec playwright install chromium
pnpm run test:e2e
```

No Windows, os mesmos comandos podem ser executados com `pnpm.cmd`. O Playwright
usa Chromium apenas e valida landing, tema, login mock, navegacao principal,
formulario de projetos, billing mockado, settings, foco visivel e ausencia de
overflow horizontal nos viewports 320, 375, 768, 1024, 1365 e 1536px.

O script `test:e2e` inicia o dev server quando necessario, reutiliza
`localhost:3000` se ele ja estiver ativo e encerra apenas o servidor que ele
mesmo iniciou.

## Roadmap

A validacao frontend esta fechada como baseline. A proxima fase documentada em
`docs/FULL_STACK_FOUNDATION.md` prepara a migracao por etapas para:

1. Definir fronteiras de repositorio e servicos.
2. Introduzir API NestJS.
3. Introduzir PostgreSQL e Prisma.
4. Migrar dominios dos mocks para API real.
5. Adicionar Docker de producao por servico.
6. Configurar Railway como deploy primario.
7. Adicionar GitHub Actions para CI/CD.
8. Endurecer seguranca, observabilidade e operacao.

## Documentacao para desenvolvimento agentico

A pasta `docs/` contem documentos praticos para orientar agentes de IA e
desenvolvedores:

- `docs/FULL_STACK_FOUNDATION.md`
- `docs/AGENT_WORKFLOWS.md`
- `docs/ARCHITECTURE.md`
- `docs/FRONTEND_PATTERNS.md`
- `docs/DATA_AND_API_CONTRACTS.md`
- `docs/ROADMAP.md`
- `docs/PRODUCTION_CHECKLIST.md`

Comece por `docs/README.md` antes de delegar ou executar tarefas agenticas.

## Docker

Crie o arquivo local de ambiente:

```bash
cp .env.example .env
```

Suba a stack de desenvolvimento atual:

```bash
pnpm run docker:dev
```

Servicos atuais:

- Frontend: `http://localhost:3000`
- PostgreSQL local: `localhost:5432`
- URL interna do banco: `postgresql://starterkit:starterkit@database:5432/starterkit?schema=public`

O PostgreSQL do Compose ainda nao e fonte de dados do app atual. Em producao, o
alvo e usar Railway Postgres como servico separado, nao embutir banco no mesmo
container da aplicacao.

## Observacoes

- `services/api-client.ts` e `services/mock-service.ts` mantem o contrato de API
  para a futura migracao por dominio.
- `lib/store.ts` concentra a simulacao atual de autenticacao, projetos, chaves
  de API, notificacoes, assinatura e logs.
- A navegacao principal usa header desktop a partir de `xl`; mobile e tablet
  usam bottom nav com safe area.
- A `Sidebar` segue disponivel como variante opcional de layout, mas nao e
  montada por padrao.
- A landing publica foi mantida enxuta e nao deve reintroduzir previews
  decorativos que disputem leitura com o hero.
- Testes cobrem componentes base, tema, store, formularios criticos e semantica
  acessivel de modais/dialogs.
- Playwright cobre um smoke visual/funcional dos fluxos principais sem backend
  real.
- O repositorio usa uma unica configuracao de ESLint: `eslint.config.mjs`.
