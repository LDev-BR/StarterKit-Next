# AGENTS.md

Instrucoes para agentes trabalhando neste repositorio.

## Escopo atual

Este repositorio e um frontend starter kit em Next.js. Nao implemente backend,
PostgreSQL real, Railway CD ou monorepo sem pedido explicito do usuario.
Apos a validacao do frontend, o desenvolvimento ativo do backend e do banco de
dados sera a proxima fase do projeto.

## Documentacao para agentes

Antes de alterar codigo, leia `docs/README.md` e o documento de dominio
relevante:

- `docs/AGENT_WORKFLOWS.md`: fluxo de trabalho, guardrails e validacao.
- `docs/ARCHITECTURE.md`: arquitetura atual e limites conhecidos.
- `docs/FRONTEND_PATTERNS.md`: padroes visuais e de UI.
- `docs/DATA_AND_API_CONTRACTS.md`: mocks, store e contratos de API.
- `docs/ROADMAP.md`: fases atuais e futuras.
- `docs/PRODUCTION_CHECKLIST.md`: criterios para producao.

Para tarefas de Next.js, App Router, build, deploy, metadata, imagens, routing,
Server Components ou Client Components, consulte a documentacao local versionada
em `node_modules/next/dist/docs/` antes de editar. Ela corresponde a versao do
Next instalada no projeto.

## Principios

- Preserve a identidade visual existente: glassmorphism, tema claro/escuro,
  microanimacoes e layout responsivo.
- Mantenha TypeScript strict e evite `any`.
- Prefira mudancas pequenas, verificaveis e alinhadas aos padroes existentes.
- Leia arquivos antes de editar.
- Nao reverta mudancas do usuario.
- Nao adicione dependencias sem necessidade clara.

## Estrutura

- `app/`: layout, pagina principal e CSS global.
- `components/ui/`: componentes reutilizaveis.
- `components/layouts/`: shell da aplicacao.
- `features/showcase/`: telas demonstrativas separadas por dominio.
- `lib/store.ts`: estado global Zustand.
- `services/`: contrato e mock de API.
- `tests/`: setup e testes Vitest.

## Validacao esperada

Antes de finalizar alterações de codigo, rode quando possível:

```bash
pnpm run lint
pnpm run lint:types
pnpm test
pnpm run build
```

No Windows, se `pnpm` for bloqueado pelo PowerShell, use `pnpm.cmd`.
