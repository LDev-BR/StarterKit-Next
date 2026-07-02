# Agent Workflows

Este documento define como agentes devem trabalhar neste repositorio sem fugir
do objetivo do starter kit: entregar uma base responsiva, reaproveitavel e facil
de evoluir para futuros produtos SaaS.

## Protocolo inicial

Antes de editar:

1. Leia `AGENTS.md`.
2. Leia `docs/README.md`.
3. Leia o documento de dominio relevante.
4. Leia os arquivos que pretende alterar.
5. Verifique `git status --short` e nao reverta alteracoes que nao foram suas.

Se a tarefa envolver Next.js, leia a documentacao local relevante em
`node_modules/next/dist/docs/`. Prefira a doc local porque ela acompanha a versao
instalada do pacote.

## Guardrails de escopo

- O projeto esta em validacao frontend.
- Nao implemente backend real sem pedido explicito.
- Nao implemente PostgreSQL real sem pedido explicito.
- Nao implemente Railway CD sem pedido explicito.
- Nao transforme o repositorio em monorepo sem pedido explicito.
- Nao adicione dependencias se o padrao atual resolve.
- Nao introduza `any`; mantenha TypeScript strict.
- Preserve a identidade visual: glassmorphism, tema claro/escuro,
  microanimacoes e layout responsivo.

## Matriz de tarefas

| Tipo de tarefa | Leia antes | Arquivos provaveis | Validacao minima |
| --- | --- | --- | --- |
| Ajuste visual ou responsivo | `FRONTEND_PATTERNS.md` | `features/showcase/**`, `components/**`, `app/globals.css` | `pnpm run lint`, `pnpm run lint:types`, browser quando houver UI |
| Novo componente reutilizavel | `FRONTEND_PATTERNS.md`, `ARCHITECTURE.md` | `components/ui/**`, `tests/**` | teste focado, lint, typecheck |
| Fluxo de dashboard/projetos/billing/settings | `ARCHITECTURE.md`, `DATA_AND_API_CONTRACTS.md` | `features/showcase/**`, `lib/store.ts` | teste ou verificacao manual do fluxo, lint, typecheck |
| Mock, estado ou contrato API | `DATA_AND_API_CONTRACTS.md` | `lib/store.ts`, `services/**`, `types/**` | teste focado, lint, typecheck |
| Roadmap, checklist ou docs | `docs/README.md` | `docs/**`, `README.md`, `AGENTS.md` | revisar links e consistencia com escopo |
| Build/deploy/Docker | `PRODUCTION_CHECKLIST.md`, docs locais do Next | `next.config.ts`, `Dockerfile`, `docker-compose.yml`, `.env.example` | `pnpm run build` e teste do container quando aplicavel |

## Fluxo recomendado para mudancas de codigo

1. Reproduza ou entenda o comportamento atual.
2. Defina o menor recorte que entrega a mudanca.
3. Edite arquivos ja existentes quando isso respeitar as responsabilidades.
4. Crie arquivos novos apenas quando houver uma fronteira clara.
5. Adicione ou ajuste testes proporcionais ao risco.
6. Rode validacoes.
7. Informe o que mudou, o que foi validado e o que nao foi possivel validar.

## Como decompor tarefas grandes

Divida por dominio de produto, nao por tecnologia isolada. Exemplos:

- "Adicionar filtro em Projetos" deve tocar `features/showcase/projects`,
  possivelmente `lib/store.ts`, e testes focados.
- "Trocar mock por endpoint real" deve primeiro preservar `IApiService`, depois
  adaptar a implementacao real, depois atualizar UI e testes.
- "Preparar backend" deve gerar primeiro contrato, schema e plano. Nao crie
  servidor real enquanto o escopo estiver em validacao frontend.

## Padroes de prompt para futuros agentes

Ao delegar uma tarefa a outro agente, inclua:

- Objetivo em uma frase.
- Estado atual: "fase de validacao frontend".
- Arquivos de entrada obrigatorios.
- O que nao fazer.
- Comandos de validacao esperados.
- Criterio de aceite visivel ao usuario.

Exemplo:

```txt
Objetivo: adicionar estado vazio responsivo na lista de projetos.
Leia: AGENTS.md, docs/FRONTEND_PATTERNS.md, features/showcase/projects/form-showcase.tsx.
Nao fazer: backend real, nova dependencia, nova rota.
Validacao: pnpm run lint, pnpm run lint:types, teste focado se alterar logica.
Aceite: em mobile e desktop, lista vazia mostra EmptyState e CTA sem quebrar o layout.
```

## Definicao de pronto

Uma mudanca esta pronta quando:

- O comportamento solicitado esta implementado.
- O escopo nao cresceu alem do pedido.
- O visual continua consistente com o starter kit.
- TypeScript continua strict sem novos `any`.
- Testes/validacoes cabiveis foram executados ou a impossibilidade foi
  explicada.
- Documentos foram atualizados quando a mudanca altera arquitetura, contratos,
  roadmap ou checklist.
