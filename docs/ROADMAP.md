# Roadmap Checklist

Este checklist orienta agentes sobre prioridade e limites durante a evolucao do
StarterKit Next para uma base full stack modular.

Legenda:

- [ ] Pendente ou a validar.
- [x] Concluido.

## Decisao de direcao

- [x] Frontend validado como baseline.
- [x] Nova fase definida como Full Stack Foundation.
- [x] Stack alvo aprovada: Next.js, NestJS, TypeScript, PostgreSQL, Prisma,
  Docker, GitHub Actions e Railway.
- [x] Railway definido como deploy primario.
- [x] AWS mantida como alternativa futura.
- [x] Supabase mantido como alternativa, nao dependencia padrao.

## Guardrails da nova fase

- [ ] Confirmar que a tarefa preserva o frontend validado.
- [ ] Confirmar que a tarefa e pequena o bastante para validar.
- [ ] Confirmar que contratos, DTOs ou docs existem antes de trocar mocks por
  API real.
- [ ] Confirmar que segredos nao entram em `NEXT_PUBLIC_*`.
- [ ] Confirmar que PostgreSQL de producao fica como servico separado, nao no
  mesmo container da aplicacao.
- [ ] Confirmar que mudancas estruturais atualizam docs e checklist.

## Fase 0: baseline frontend validado

Objetivo:

- [x] Validar a experiencia SaaS do starter kit como base visual e tecnica para
  futuros produtos.

Criterio de saida:

- [x] Fluxos principais funcionam sem erro em 320, 375, 768, 1024, 1365 e
  1536px.
- [x] Tema claro/escuro consistente.
- [x] Formularios validam e exibem feedback corretamente.
- [x] Estados vazio, loading e erro existem onde fazem sentido no frontend.
- [x] `pnpm run lint`, `pnpm run lint:types`, `pnpm test`,
  `pnpm run build` e `pnpm run test:e2e` passaram localmente.
- [x] Documentacao em `docs/` refletia a arquitetura frontend no fechamento.

Progresso do fechamento:

- [x] Testes adicionados para store, auth, projetos, settings e overlays.
- [x] Componentes `Modal` e `Dialog` expõem semantica acessivel de dialogo.
- [x] Copies deixam claro quais partes eram mockadas.
- [x] Header, drawer mobile, toggle de senha, medidores de billing e controles
  segmentados ganharam semantica acessivel adicional.
- [x] API keys mockadas usam prefixo `sk_mock_`.
- [x] Playwright Chromium cobre 320, 375, 768, 1024, 1365 e 1536px.
- [x] Header evita sobreposicao em tablets usando bottom nav ate antes de `xl`.
- [x] Menu do usuario foi simplificado sem toggle de dark mode.
- [x] Landing foi enxugada.

## Fase 1: documentacao da Full Stack Foundation

Objetivo:

- [x] Atualizar os documentos para orientar meses de evolucao full stack sem
  implementar a stack ainda.

Trabalho esperado:

- [x] Criar `docs/FULL_STACK_FOUNDATION.md`.
- [x] Atualizar `AGENTS.md`.
- [x] Atualizar `README.md`.
- [x] Atualizar `docs/README.md`.
- [x] Atualizar arquitetura, contratos, workflows, roadmap e checklist.
- [x] Revisar consistencia final dos docs.

Criterio de saida:

- [x] O repo nao trata mais backend real como proibido por padrao.
- [x] O estado atual continua descrito como frontend validado com mocks.
- [x] O alvo Next + Nest + PostgreSQL + Prisma + Docker + Railway esta claro.
- [x] Guardrails impedem big bang e quebra do frontend validado.

## Fase 2: desenho de repositorio e fronteiras

Objetivo:

- [ ] Definir como Next.js web, NestJS API e Prisma viverao no mesmo repositorio.

Trabalho esperado:

- [ ] Escolher estrutura fisica: raiz atual com transicao gradual, `web/api`, ou
  `apps/web` e `apps/api`.
- [ ] Decidir se havera workspace/monorepo formal e por que.
- [ ] Definir ownership de tipos compartilhados.
- [ ] Definir padrao de env vars por servico.
- [ ] Definir estrategia de package scripts.
- [ ] Definir estrategia de Docker local e producao.

Criterio de saida:

- [ ] Plano aprovado antes de mover arquivos.
- [ ] Frontend atual continua executavel.
- [ ] Caminho de rollback documentado.

## Fase 3: API NestJS inicial

Objetivo:

- [ ] Introduzir uma API NestJS minima e testavel.

Trabalho esperado:

- [ ] Scaffold ou configuracao NestJS com TypeScript strict.
- [ ] Healthcheck HTTP.
- [ ] Padrao de modulos, controllers, services, DTOs, filters e guards.
- [ ] Testes unitarios iniciais.
- [ ] Documentacao de como rodar web e API localmente.

Criterio de saida:

- [ ] API roda localmente.
- [ ] Healthcheck passa.
- [ ] Lint/typecheck/testes cobrem a API inicial.
- [ ] Nenhum fluxo frontend atual foi quebrado.

## Fase 4: Prisma e PostgreSQL

Objetivo:

- [ ] Introduzir persistencia real com migrations reproduziveis.

Trabalho esperado:

- [ ] Instalar/configurar Prisma.
- [ ] Criar `schema.prisma` inicial.
- [ ] Definir migration inicial.
- [ ] Criar seed local com dados fake.
- [ ] Conectar API ao PostgreSQL local por `DATABASE_URL`.
- [ ] Documentar comandos de migration/generate/seed.

Criterio de saida:

- [ ] Migration roda localmente.
- [ ] `prisma generate` passa.
- [ ] API consegue checar conexao com banco.
- [ ] Segredos continuam fora do frontend.

## Fase 5: migracao de dominios

Objetivo:

- [ ] Substituir mocks por API real por dominio, sem big bang.

Ordem recomendada:

- [ ] Health/config.
- [ ] Users/profile.
- [ ] Projects.
- [ ] Activity logs.
- [ ] API keys.
- [ ] Billing sem pagamento real.
- [ ] Auth real.

Criterio por dominio:

- [ ] DTOs definidos.
- [ ] Prisma model/migration quando houver persistencia.
- [ ] Nest service/controller testados.
- [ ] Frontend integrado.
- [ ] Mock mantido ou removido com justificativa.
- [ ] Docs atualizados.

## Fase 6: Docker e Railway

Objetivo:

- [ ] Preparar deploy primario no Railway.

Trabalho esperado:

- [ ] Definir Dockerfile(s) por servico.
- [ ] Atualizar Docker Compose local para web, API e Postgres quando existirem.
- [ ] Configurar Railway Postgres.
- [ ] Documentar variaveis por servico.
- [ ] Configurar healthchecks.
- [ ] Configurar pre-deploy command para Prisma migrations.
- [ ] Validar build/start de imagem.

Criterio de saida:

- [ ] Aplicacao sobe em ambiente Railway.
- [ ] Banco e aplicacao sao servicos separados.
- [ ] Migrations rodam de forma controlada.
- [ ] Healthcheck valida runtime e dependencias essenciais.

## Fase 7: GitHub Actions e CI/CD

Objetivo:

- [ ] Automatizar validacoes e deploy com gates claros.

Trabalho esperado:

- [ ] Workflow de lint.
- [ ] Workflow de typecheck.
- [ ] Workflow de testes.
- [ ] Workflow de build.
- [ ] Build de imagens Docker quando aplicavel.
- [ ] Deploy Railway quando secrets e ambientes estiverem configurados.

Criterio de saida:

- [ ] PRs ou pushes executam validacoes obrigatorias.
- [ ] Falha bloqueia deploy.
- [ ] Segredos ficam no provedor correto, nao no repositorio.
- [ ] Rollback ou redeploy manual documentado.

## Fase 8: producao e hardening

Objetivo:

- [ ] Tornar a aplicacao operavel com seguranca, performance e processo de
  release.

Trabalho esperado:

- [ ] Auth real e autorizacao.
- [ ] Rate limiting em endpoints sensiveis.
- [ ] Headers de seguranca e CORS.
- [ ] Logs estruturados sem dados sensiveis.
- [ ] Observabilidade.
- [ ] Backups e restore testados.
- [ ] Runbook de incidentes.
- [ ] Auditoria de dependencias.
- [ ] AWS avaliada apenas se Railway deixar de atender requisitos.

## Backlog tecnico util

- [x] Adicionar testes para `lib/store.ts`.
- [x] Adicionar testes de formularios para projetos, auth e settings.
- [x] Avaliar `Sidebar` como variante opcional de layout.
- [x] Adicionar Playwright para smoke responsivo.
- [ ] Extrair partes muito grandes de showcases quando uma nova tarefa tocar
  nelas.
- [ ] Planejar estrutura fisica web/API antes de scaffold NestJS.
- [ ] Planejar contrato inicial de auth antes de implementar login real.
- [ ] Adicionar CI quando o fluxo full stack estabilizar.
