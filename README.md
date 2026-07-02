# StarterKit Next

Starter Kit frontend em Next.js, React, TypeScript, Tailwind CSS v4, Zustand,
React Hook Form, Zod, Motion e Vitest.

O projeto entrega uma experiencia SaaS demonstrativa com autenticacao simulada,
dashboard, projetos, assinatura, configuracoes, componentes de UI e tema claro/escuro.
A camada visual premium foi preservada: glassmorphism, microanimacoes e layout responsivo.

## Stack

- Next.js 16 com App Router
- React 19
- TypeScript em modo strict
- Tailwind CSS v4 via `@tailwindcss/postcss`
- Zustand para estado global
- React Hook Form + Zod para formularios
- Motion para animacoes
- Vitest + Testing Library para testes
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
```

## Roadmap

O foco atual e validar a experiencia frontend: fluxos, componentes, tema,
responsividade, contratos de API e qualidade de build. Depois dessa validacao,
comeca o desenvolvimento ativo do backend e do banco de dados, substituindo
gradualmente os mocks em `services/` e `lib/store.ts` por integracoes reais.

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
- `.vscode/settings.json` e opcional para execucao, mas fica versionado para compartilhar ajustes neutros do projeto no VS Code, como evitar falso positivo de regras CSS usadas pelo Tailwind.
- O repositorio usa uma unica configuracao de ESLint: `eslint.config.mjs`.
