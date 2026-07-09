# Full Stack Foundation

Este documento define a nova fase do StarterKit Next. Ele orienta agentes e
desenvolvedores a evoluir o repositorio de uma base frontend validada para uma
aplicacao full stack real, modular e pronta para gerar novos apps.

## Estado atual

O repositorio atual ainda e uma aplicacao Next.js com:

- UI SaaS validada em landing, auth mock, dashboard, projetos, billing e
  settings.
- Tema claro/escuro, glassmorphism, microanimacoes e layout responsivo.
- Zustand para estado client-side.
- Mocks em `lib/store.ts` e `services/mock-service.ts`.
- Testes Vitest e smoke Playwright Chromium.
- Docker e Docker Compose locais, com PostgreSQL disponivel mas ainda nao
  integrado ao app.

Este estado deve continuar funcionando durante a migracao. A nova fase nao
autoriza quebrar o frontend validado para implementar backend em big bang.

## Estado alvo

A arquitetura alvo aprovada para os proximos ciclos e:

- Next.js para a aplicacao web.
- NestJS para a API backend no mesmo repositorio.
- TypeScript strict em todas as camadas.
- PostgreSQL como banco relacional.
- Prisma como ORM, schema e migrations.
- Docker como unidade de empacotamento.
- Railway como alvo primario de deploy.
- GitHub Actions para CI/CD.
- AWS como alternativa futura quando houver necessidade real.
- Supabase apenas como alternativa futura para casos especificos, nao como
  dependencia padrao.

## Principio de evolucao

O projeto deve evoluir por fases pequenas e verificaveis:

1. Documentar decisoes e contratos antes de implementar infraestrutura.
2. Preservar a UI atual enquanto os dominios migram de mocks para API real.
3. Introduzir NestJS, Prisma, PostgreSQL, Docker e CI/CD em etapas separadas.
4. Validar cada etapa com lint, typecheck, testes e build cabiveis.
5. Manter fronteiras claras entre UI, contratos, API, dominio e persistencia.

## Arquitetura planejada

O repositorio deve caminhar para duas aplicacoes principais:

- `web`: aplicacao Next.js responsavel por rotas, UI, experiencia de produto e
  consumo da API.
- `api`: aplicacao NestJS responsavel por endpoints, regras de dominio,
  autenticacao/autorizacao, integracoes, healthcheck e acesso a dados.

A separacao fisica exata ainda deve ser definida antes da implementacao. Opcoes
aceitaveis incluem pastas dedicadas como `apps/web` e `apps/api`, ou uma etapa
intermediaria que preserve a raiz atual enquanto prepara a migracao. Nao converta
o repositorio para monorepo ou workspace completo sem um plano explicito.

## Next.js

O Next.js atual permanece como base do frontend. Futuras alteracoes devem:

- Consultar a documentacao local versionada em `node_modules/next/dist/docs/`.
- Usar Server Components para leitura server-side quando fizer sentido.
- Usar Client Components apenas para interatividade de browser.
- Evitar acoplar componentes diretamente a segredos ou conexoes de banco.
- Para deploy self-hosted/Docker, avaliar `output: "standalone"` conforme a doc
  local do Next antes de alterar `next.config.ts`.

## NestJS

NestJS e o alvo para a API real. A implementacao futura deve priorizar:

- Modulos por dominio.
- Controllers finos.
- Services com regras de negocio.
- DTOs tipados e validacao explicita.
- Guards para autenticacao/autorizacao.
- Pipes e filtros para validacao e erro padronizado.
- Healthcheck operacional.
- OpenAPI/Swagger quando os contratos HTTP estabilizarem.

NestJS deve entrar como API separada do frontend, nao como codigo misturado em
componentes React.

## PostgreSQL e Prisma

PostgreSQL deve ser o banco padrao. Prisma deve controlar:

- `schema.prisma`.
- Client gerado.
- Migrations versionadas.
- Seeds locais quando necessarios.

Regras:

- `DATABASE_URL` e segredo server-side; nunca exponha em `NEXT_PUBLIC_*`.
- Migrations devem ser revisadas antes de rodar em ambientes compartilhados.
- Seeds locais nao devem conter dados sensiveis reais.
- Nao remova mocks ate haver cobertura e caminho de rollback para o dominio
  migrado.

## Railway

Railway e o alvo primario porque reduz o trabalho operacional inicial.

Direcao esperada:

- Railway Postgres como banco gerenciado.
- Aplicacao e banco como servicos separados.
- Variaveis por servico.
- Healthchecks configurados antes de considerar deploy pronto.
- Pre-deploy command para migrations Prisma quando Prisma existir.
- Dockerfile ou build config por servico quando a separacao web/API estiver
  definida.

Nao coloque PostgreSQL dentro do mesmo container da aplicacao em producao.

## Docker

Docker deve ser usado como unidade de empacotamento e reproducibilidade.

Diretrizes:

- Evitar multiplos processos independentes no mesmo container em producao.
- Preferir um container por servico quando Next e Nest estiverem separados.
- Manter imagens enxutas e sem segredos embutidos.
- Usar `.env.example` para documentar variaveis, nao para guardar credenciais.
- Testar build de imagem antes de promover para ambiente compartilhado.

## GitHub Actions e CI/CD

CI/CD deve entrar de forma incremental:

1. Lint e typecheck.
2. Testes unitarios/componentes.
3. Build.
4. E2E quando a mudanca tocar fluxos principais.
5. Build de imagem Docker.
6. Deploy Railway com gates claros.

Deploy automatico so deve ser habilitado quando variaveis, migrations,
healthcheck e rollback estiverem documentados.

## AWS futura

AWS fica como rota futura, nao como alvo inicial. A migracao para AWS deve ser
considerada quando houver necessidade de controle maior, compliance, escala ou
integracao com servicos AWS.

Direcao provavel:

- ECS/Fargate para containers.
- RDS PostgreSQL para banco.
- ECR para imagens.
- CloudWatch para logs/metricas.
- IAM/OIDC para GitHub Actions.

Nao introduza AWS nesta fase sem pedido explicito.

## Supabase

Supabase nao e dependencia padrao. Pode ser reavaliado se o projeto precisar de
Auth, Storage, Realtime ou painel operacional gerenciado com baixo tempo de
implementacao. Se for usado, trate RLS, secrets e integracao server-side como
decisoes de seguranca, nao como detalhe de conveniencia.

## Guardrails para agentes

- Leia este documento antes de tarefas de backend, banco, Prisma, Docker,
  Railway, CI/CD ou arquitetura.
- Mantenha o estado atual funcionando enquanto evolui a stack.
- Prefira migracoes por dominio: auth, users, projects, activity logs, billing,
  settings.
- Nao misture dados mockados e reais sem deixar a origem explicita.
- Nao adicione dependencias estruturais sem justificar o papel delas na fase.
- Nao mova arquivos em massa sem um plano de migracao e validacao.
- Atualize docs quando alterar arquitetura, contratos, deploy, variaveis ou
  processo.

## Validacao esperada por tipo de mudanca

- Docs: revisar links, caminhos e consistencia entre documentos.
- Frontend: `pnpm run lint`, `pnpm run lint:types`, `pnpm test`, e Playwright
  quando tocar fluxos principais.
- API futura: lint, typecheck, testes unitarios de services/controllers e testes
  de contrato quando existirem.
- Banco futuro: validar migration local, Prisma generate, seeds e testes de
  integracao quando existirem.
- Docker/deploy futuro: build de imagem, start local, healthcheck e smoke
  minimo.

No Windows, use `pnpm.cmd` se o PowerShell bloquear o shim `pnpm`.
