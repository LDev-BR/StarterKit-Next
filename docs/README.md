# Documentacao do StarterKit Next

Esta pasta existe para acelerar desenvolvimento agentico neste starter kit.
Cada documento deve ajudar um agente a tomar decisoes melhores antes de editar
codigo. Evite adicionar documentos conceituais sem efeito direto no trabalho.

## Ordem recomendada para agentes

1. Leia `AGENTS.md` na raiz.
2. Leia este indice.
3. Leia `FULL_STACK_FOUNDATION.md` para entender a nova fase.
4. Leia o documento especifico do tipo de tarefa.
5. Leia os arquivos reais antes de editar.
6. Rode a validacao cabivel antes de finalizar.

Para tarefas de Next.js, App Router, build, deploy, imagens, metadata, routing,
Server Components ou Client Components, consulte tambem a documentacao local
versionada em `node_modules/next/dist/docs/`. Ela corresponde a versao instalada
do Next neste repositorio.

Para tarefas de NestJS, Prisma, PostgreSQL, Docker, Railway, GitHub Actions ou
AWS, consulte `FULL_STACK_FOUNDATION.md` antes de decidir estrutura, contratos ou
fases de implementacao.

## Mapa dos documentos

- `FULL_STACK_FOUNDATION.md`: direcao central da nova fase full stack, incluindo
  Next.js, NestJS, PostgreSQL, Prisma, Docker, Railway, CI/CD e AWS futura.
- `AGENT_WORKFLOWS.md`: protocolos de trabalho para agentes, guardrails,
  matriz de validacao e como decompor tarefas.
- `ARCHITECTURE.md`: arquitetura atual, arquitetura alvo, fluxo de renderizacao,
  estado global, componentes principais e limites conhecidos.
- `FRONTEND_PATTERNS.md`: padroes de UI, responsividade, tema, formularios,
  animacoes e testes de frontend.
- `DATA_AND_API_CONTRACTS.md`: contratos atuais de estado, API mockada e caminho
  para API NestJS, DTOs, Prisma e PostgreSQL.
- `ROADMAP.md`: fases do projeto a partir da base frontend validada ate a base
  full stack com Railway.
- `PRODUCTION_CHECKLIST.md`: checklist objetivo para evoluir de baseline
  frontend para aplicacao full stack pronta para producao.
- `superpowers/specs/`: decisoes e specs aprovadas durante planejamento.
- `superpowers/plans/`: planos de execucao para mudancas multi-arquivo.

## Estado atual

O repositorio e uma base Next.js com experiencia SaaS validada: landing,
autenticacao simulada, dashboard, projetos, assinatura, configuracoes, tema
claro/escuro, componentes reutilizaveis, mocks, testes Vitest e smoke
Playwright Chromium.

O foco agora e a fase Full Stack Foundation: preparar e executar, por etapas, a
evolucao para Next.js + NestJS + PostgreSQL + Prisma + Docker + GitHub Actions +
Railway. O estado atual com mocks deve continuar funcional durante a migracao.

## Comandos de validacao

No Windows, use `pnpm.cmd` se o PowerShell bloquear `pnpm`.

```bash
pnpm run lint
pnpm run lint:types
pnpm test
pnpm run build
pnpm exec playwright install chromium
pnpm run test:e2e
```

Para mudancas pequenas em docs, a validacao minima e ler os arquivos alterados e
confirmar que os links/caminhos citados existem. Para mudancas de codigo, rode a
sequencia completa quando possivel. O Playwright fica em `e2e/` e usa apenas
Chromium para validar 320, 375, 768, 1024, 1365 e 1536px.

O script `test:e2e` usa `scripts/run-playwright-e2e.mjs` para iniciar o dev
server quando necessario, reutilizar `localhost:3000` se ele ja estiver ativo e
encerrar apenas o servidor iniciado pelo proprio script.

Futuras mudancas de API, banco, Prisma, Docker e CI/CD devem adicionar validacao
especifica conforme `FULL_STACK_FOUNDATION.md`.

## Referencias externas

Use referencias externas apenas quando o contexto local nao bastar. Para Next.js,
prefira primeiro `node_modules/next/dist/docs/`.

- Next.js AI Coding Agents: https://nextjs.org/docs/app/guides/ai-agents
- Next.js Project Structure: https://nextjs.org/docs/app/getting-started/project-structure
- Next.js Production Checklist: https://nextjs.org/docs/app/guides/production-checklist
- Next.js Deploying: https://nextjs.org/docs/app/getting-started/deploying
- Next.js Self-hosting: https://nextjs.org/docs/app/guides/self-hosting
- Next.js Standalone Output: https://nextjs.org/docs/app/api-reference/config/next-config-js/output
- Railway Dockerfiles: https://docs.railway.com/builds/dockerfiles
- Railway Next.js + Postgres: https://docs.railway.com/guides/nextjs
- Railway NestJS: https://docs.railway.com/guides/nest
- NestJS Docs: https://docs.nestjs.com/
- Prisma Docs: https://www.prisma.io/docs
