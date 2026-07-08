# StarterKit Next

Starter Kit frontend em Next.js, React, TypeScript, Tailwind CSS v4, Zustand,
React Hook Form, Zod, Motion, Vitest e Playwright.

O projeto entrega uma experiencia SaaS demonstrativa com autenticacao simulada,
dashboard, projetos, assinatura, configuracoes, componentes de UI e tema claro/escuro.
A camada visual premium foi preservada: glassmorphism, microanimacoes e layout responsivo.
Backend real, persistencia real e CI versionado ainda nao fazem parte desta
fase; os fluxos usam mocks e estado em memoria.

## Stack

- Next.js 16 com App Router
- React 19
- TypeScript em modo strict
- Tailwind CSS v4 via `@tailwindcss/postcss`
- Zustand para estado global
- React Hook Form + Zod para formularios
- Motion para animacoes
- Vitest + Testing Library para testes unitarios e de componentes
- Playwright Chromium para smoke E2E em desktop, tablet e mobile
- Docker Compose com frontend e PostgreSQL local

## Estrutura

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
e2e/                         Smoke tests Playwright da validacao frontend
types/                       Tipos compartilhados
.vscode/                     Ajustes compartilhados do VS Code, sem impacto no runtime
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
formulario de projetos e billing mockado em viewports desktop, tablet e mobile.

## Roadmap

O foco atual e validar a experiencia frontend: fluxos, componentes, tema,
responsividade, contratos de API e qualidade de build. Depois dessa validacao,
comeca o desenvolvimento ativo do backend e do banco de dados, substituindo
gradualmente os mocks em `services/` e `lib/store.ts` por integracoes reais.

## Documentacao para desenvolvimento agentico

A pasta `docs/` contem documentos praticos para orientar agentes de IA e
desenvolvedores:

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

Suba a stack de desenvolvimento:

```bash
pnpm run docker:dev
```

Servicos:

- Frontend: `http://localhost:3000`
- PostgreSQL: `localhost:5432`
- URL interna do banco: `postgresql://starterkit:starterkit@database:5432/starterkit?schema=public`

## Observacoes

- `services/api-client.ts` e `services/mock-service.ts` mantem o contrato de API para uma futura troca dos mocks por endpoints reais.
- `lib/store.ts` concentra a simulacao atual de autenticacao, projetos, chaves de API, notificacoes, assinatura e logs.
- Testes cobrem componentes base, tema, store, formularios criticos e
  semantica acessivel de modais/dialogs.
- Playwright cobre um smoke visual/funcional dos fluxos principais sem backend
  real.
- `.vscode/settings.json` e opcional para execucao, mas fica versionado para compartilhar ajustes neutros do projeto no VS Code, como evitar falso positivo de regras CSS usadas pelo Tailwind.
- O repositorio usa uma unica configuracao de ESLint: `eslint.config.mjs`.
