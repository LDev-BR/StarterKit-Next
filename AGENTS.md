# AGENTS.md

Instrucoes para agentes trabalhando neste repositorio.

## Escopo atual

Este repositorio esta entrando na fase de Full Stack Foundation. O frontend
Next.js validado continua sendo a base atual, mas o alvo aprovado e evoluir para
uma aplicacao full stack modular com Next.js, NestJS, TypeScript, PostgreSQL,
Prisma, Docker, GitHub Actions e deploy primario no Railway.

O trabalho deve acontecer por fases pequenas e verificaveis. Backend, banco,
NestJS, Prisma, Docker, CI/CD e deploy podem ser implementados quando a tarefa
pedir, mas nunca em big bang. Preserve o frontend atual, defina contratos,
adicione testes proporcionais e atualize a documentacao.

## Documentacao para agentes

Antes de alterar codigo, leia `docs/README.md` e o documento de dominio
relevante:

- `docs/AGENT_WORKFLOWS.md`: fluxo de trabalho, guardrails e validacao.
- `docs/ARCHITECTURE.md`: arquitetura atual e arquitetura alvo.
- `docs/FULL_STACK_FOUNDATION.md`: direcao alvo para Next.js, NestJS, Prisma,
  PostgreSQL, Docker, Railway e CI/CD.
- `docs/FRONTEND_PATTERNS.md`: padroes visuais e de UI.
- `docs/DATA_AND_API_CONTRACTS.md`: mocks, store, DTOs e caminho para API real.
- `docs/ROADMAP.md`: fases atuais e futuras.
- `docs/PRODUCTION_CHECKLIST.md`: criterios para producao.

Para tarefas de Next.js, App Router, build, deploy, metadata, imagens, routing,
Server Components ou Client Components, consulte a documentacao local versionada
em `node_modules/next/dist/docs/` antes de editar. Ela corresponde a versao do
Next instalada no projeto.

Para tarefas de NestJS, Prisma, PostgreSQL, Docker, Railway, GitHub Actions ou
AWS, consulte primeiro `docs/FULL_STACK_FOUNDATION.md` e depois a documentacao
oficial atual quando a implementacao exigir detalhes de ferramenta.

## Principios

- Preserve a identidade visual existente: glassmorphism, tema claro/escuro,
  microanimacoes e layout responsivo.
- Mantenha TypeScript strict e evite `any`.
- Prefira mudancas pequenas, verificaveis e alinhadas aos padroes existentes.
- Preserve contratos enquanto migrar mocks para API real.
- Trate `DATABASE_URL`, tokens e chaves como segredos server-side; nunca exponha
  em `NEXT_PUBLIC_*`.
- Use Railway como alvo primario de deploy e AWS apenas como alternativa futura
  quando houver pedido explicito.
- Supabase nao e dependencia padrao; avalie apenas se houver pedido explicito ou
  necessidade clara de Auth/Storage/Realtime gerenciados.
- Leia arquivos antes de editar.
- Nao reverta mudancas do usuario.
- Nao adicione dependencias sem necessidade clara.

## Estrutura

Estrutura atual:

- `app/`: layout, pagina principal e CSS global.
- `components/ui/`: componentes reutilizaveis.
- `components/layouts/`: shell da aplicacao.
- `features/showcase/`: telas demonstrativas separadas por dominio.
- `lib/store.ts`: estado global Zustand.
- `services/`: contrato e mock de API.
- `tests/`: setup e testes Vitest.

Estrutura alvo futura, ainda a definir por plano especifico:

- `web` ou `apps/web`: aplicacao Next.js.
- `api` ou `apps/api`: API NestJS.
- `prisma/`: schema, migrations e seeds.
- `.github/workflows/`: CI/CD quando a fase permitir.

## Validacao esperada

Antes de finalizar alteracoes de codigo, rode quando possivel:

```bash
pnpm run lint
pnpm run lint:types
pnpm test
pnpm run build
```

No Windows, se `pnpm` for bloqueado pelo PowerShell, use `pnpm.cmd`.

Para mudancas apenas em documentacao, revise consistencia, links e caminhos
citados. Para futuras mudancas de API, banco, Prisma, Docker ou CI/CD, adicione
validacoes especificas descritas em `docs/FULL_STACK_FOUNDATION.md`.
