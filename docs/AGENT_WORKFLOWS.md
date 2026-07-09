# Agent Workflows

Este documento define como agentes devem trabalhar neste repositorio durante a
fase Full Stack Foundation: preservar o frontend validado e evoluir, por etapas,
para uma base com Next.js, NestJS, PostgreSQL, Prisma, Docker, GitHub Actions e
Railway.

## Protocolo inicial

Antes de editar:

1. Leia `AGENTS.md`.
2. Leia `docs/README.md`.
3. Leia `docs/FULL_STACK_FOUNDATION.md`.
4. Leia o documento de dominio relevante.
5. Leia os arquivos que pretende alterar.
6. Verifique `git status --short` e nao reverta alteracoes que nao foram suas.

Se a tarefa envolver Next.js, leia a documentacao local relevante em
`node_modules/next/dist/docs/`. Prefira a doc local porque ela acompanha a versao
instalada do pacote.

Se a tarefa envolver NestJS, Prisma, PostgreSQL, Docker, Railway, GitHub Actions
ou AWS, use `docs/FULL_STACK_FOUNDATION.md` como decisao local e consulte docs
oficiais atuais antes de implementar detalhes que mudam com frequencia.

## Guardrails de escopo

- O frontend atual e o baseline validado; nao quebre fluxos existentes para
  introduzir backend.
- Backend real, banco real, Prisma, Docker de producao e CI/CD sao permitidos
  quando a tarefa pedir, mas devem entrar por fases pequenas e verificaveis.
- Nao faca migracao big bang de mocks para API real.
- Nao converta para monorepo/workspace completo sem plano explicito.
- Nao adicione dependencia estrutural sem justificar o papel dela na fase.
- Nao exponha segredos em `NEXT_PUBLIC_*`.
- Nao coloque PostgreSQL dentro do mesmo container da aplicacao em producao.
- Preserve TypeScript strict e evite `any`.
- Preserve a identidade visual: glassmorphism, tema claro/escuro,
  microanimacoes e layout responsivo.

## Matriz de tarefas

| Tipo de tarefa | Leia antes | Arquivos provaveis | Validacao minima |
| --- | --- | --- | --- |
| Ajuste visual ou responsivo | `FRONTEND_PATTERNS.md` | `features/showcase/**`, `components/**`, `app/globals.css` | `pnpm run lint`, `pnpm run lint:types`, teste focado, `pnpm run test:e2e` quando tocar fluxo principal ou breakpoints |
| Novo componente reutilizavel | `FRONTEND_PATTERNS.md`, `ARCHITECTURE.md` | `components/ui/**`, `tests/**` | teste focado, lint, typecheck |
| Fluxo atual de dashboard/projetos/billing/settings | `ARCHITECTURE.md`, `DATA_AND_API_CONTRACTS.md` | `features/showcase/**`, `lib/store.ts`, `services/**` | teste focado, lint, typecheck e smoke Playwright quando fluxo principal mudar |
| Contrato ou mock atual | `DATA_AND_API_CONTRACTS.md` | `lib/store.ts`, `services/**`, `types/**` | teste focado, lint, typecheck |
| Planejamento full stack | `FULL_STACK_FOUNDATION.md`, `ROADMAP.md` | `docs/**`, `README.md`, `AGENTS.md` | revisar links, caminhos e consistencia entre docs |
| NestJS API futura | `FULL_STACK_FOUNDATION.md`, `DATA_AND_API_CONTRACTS.md` | `api/**` ou `apps/api/**`, `tests/**` | lint, typecheck, testes unitarios de services/controllers e testes de contrato quando existirem |
| Prisma/PostgreSQL futuro | `FULL_STACK_FOUNDATION.md`, `DATA_AND_API_CONTRACTS.md` | `prisma/**`, `.env.example`, `api/**` | migration local, `prisma generate`, testes de integracao quando existirem |
| Docker/Railway futuro | `FULL_STACK_FOUNDATION.md`, `PRODUCTION_CHECKLIST.md` | `Dockerfile*`, `docker-compose.yml`, Railway config, `.env.example` | build de imagem, start local, healthcheck e smoke minimo |
| GitHub Actions futuro | `FULL_STACK_FOUNDATION.md`, `PRODUCTION_CHECKLIST.md` | `.github/workflows/**` | validar workflow com lint/typecheck/tests/build e segredos documentados |

## Fluxo recomendado para mudancas de codigo

1. Entenda o comportamento atual e o estado alvo da fase.
2. Defina o menor recorte que entrega a mudanca.
3. Preserve contratos publicos enquanto migra implementacoes.
4. Edite arquivos ja existentes quando isso respeitar responsabilidades.
5. Crie arquivos novos apenas quando houver fronteira clara.
6. Adicione ou ajuste testes proporcionais ao risco.
7. Rode validacoes.
8. Informe o que mudou, o que foi validado e o que nao foi possivel validar.

## Como decompor tarefas grandes

Divida por dominio de produto e por camada de responsabilidade. Exemplos:

- "Migrar Projetos para API real" deve preservar UI, definir DTOs, criar modulo
  Nest, persistir via Prisma, manter mock fallback ate haver cobertura, e so
  depois trocar o consumo do frontend.
- "Adicionar Prisma" deve primeiro documentar variaveis, schema inicial,
  migrations e seed, sem migrar todos os dominios de uma vez.
- "Preparar Railway" deve separar aplicacao e banco como servicos, definir env
  vars, healthcheck e pre-deploy migrations antes de habilitar deploy automatico.
- "Introduzir NestJS" deve criar a API minima, healthcheck e padrao de modulo
  antes de mover regras de negocio.

## Padroes de prompt para futuros agentes

Ao delegar uma tarefa a outro agente, inclua:

- Objetivo em uma frase.
- Estado atual relevante: "frontend validado; fase Full Stack Foundation".
- Arquivos de entrada obrigatorios.
- O que nao fazer.
- Comandos de validacao esperados.
- Criterio de aceite visivel ao usuario.

Exemplo:

```txt
Objetivo: planejar o modulo Projects da API NestJS sem implementar endpoints.
Leia: AGENTS.md, docs/FULL_STACK_FOUNDATION.md, docs/DATA_AND_API_CONTRACTS.md.
Nao fazer: instalar NestJS, criar migrations, alterar UI ou remover mocks.
Validacao: revisar links/caminhos e garantir consistencia com ROADMAP.
Aceite: documento define DTOs, responsabilidades, erros e sequencia de migracao.
```

Para fechamento de mudancas de codigo, acrescente `pnpm test`, `pnpm run build`
e `pnpm run test:e2e` quando o fluxo principal for afetado. No Windows, use
`pnpm.cmd` quando necessario.

## Definicao de pronto

Uma mudanca esta pronta quando:

- O comportamento ou documento solicitado foi entregue.
- O escopo nao cresceu alem do pedido.
- O frontend validado continua protegido quando houver codigo.
- TypeScript continua strict sem novos `any`.
- Segredos nao foram expostos ao browser.
- Testes/validacoes cabiveis foram executados ou a impossibilidade foi
  explicada.
- Documentos foram atualizados quando a mudanca altera arquitetura, contratos,
  roadmap, deploy, variaveis ou checklist.
