# Full Stack Foundation Design

Data: 2026-07-08

## Contexto

O repositorio esta saindo da fase de validacao frontend. O estado atual ainda e
um starter kit Next.js com UI SaaS, mocks, Zustand, testes Vitest e smoke
Playwright. A documentacao antiga bloqueava backend real, banco real, deploy e
reorganizacao de repositorio porque o foco anterior era validar o frontend.

A nova fase deve preparar o projeto para evoluir durante semanas ou meses para
uma aplicacao full stack real, funcional, modular e reaproveitavel como base de
novos apps.

## Decisao aprovada

A direcao tecnica aprovada e uma base full stack modular com:

- Next.js para aplicacao web e frontend.
- NestJS para API backend no mesmo repositorio.
- TypeScript strict em todas as camadas.
- PostgreSQL como banco relacional.
- Prisma como ORM e ferramenta de migrations.
- Docker como unidade de empacotamento.
- Railway como alvo primario de deploy.
- GitHub Actions como CI/CD.
- AWS como alternativa futura, nao alvo inicial.
- Supabase apenas como alternativa futura para casos especificos, nao
  dependencia padrao.

## Principios

- Documentar antes de implementar mudancas estruturais.
- Migrar de mocks para backend real por dominio, preservando contratos e testes.
- Evitar big bang: Next, Nest, Prisma, banco, Docker e CI/CD entram por fases.
- Manter o frontend validado funcionando durante a migracao.
- Preferir fronteiras claras entre UI, contratos, API, dominio e persistencia.
- Nao esconder segredo no frontend nem em variaveis `NEXT_PUBLIC_*`.
- Manter Docker e variaveis de ambiente portaveis para facilitar Railway agora e
  AWS depois.

## Arquitetura alvo

O repositorio deve evoluir para um arranjo com duas aplicacoes principais no
mesmo repo:

- Web app Next.js: rotas, layout, UI, Server Components quando fizer sentido,
  Client Components apenas quando houver interatividade de browser.
- API NestJS: modulos de dominio, controllers, services, DTOs, guards, pipes,
  tratamento padronizado de erros, healthcheck e contratos HTTP.

PostgreSQL deve ser um servico separado do container da aplicacao em producao.
No Railway, o banco deve ser um Railway Postgres conectado por `DATABASE_URL`.
Em desenvolvimento local, Docker Compose pode subir Postgres junto dos servicos
necessarios.

Prisma deve ser a camada padrao de schema, client e migrations. Migrations devem
rodar em ambiente de deploy de forma explicita e verificavel antes da nova
versao receber trafego.

## Deploy alvo

Railway e o alvo primario porque reduz trabalho operacional. A documentacao deve
orientar:

- servicos separados para web/API quando a separacao estiver implementada;
- Railway Postgres como banco gerenciado;
- variaveis de ambiente por servico;
- healthchecks;
- Dockerfiles ou build configuration adequados;
- pre-deploy command para migrations Prisma;
- GitHub Actions para lint, typecheck, testes, build e eventual deploy.

AWS deve ficar documentada como rota futura, provavelmente via ECS/Fargate e RDS,
quando o projeto precisar de mais controle operacional, compliance ou escala.

## Escopo da atualizacao de documentacao

Atualizar os documentos para refletir a nova fase:

- `AGENTS.md`: trocar o escopo ativo e os guardrails.
- `README.md`: explicar estado atual e direcao full stack.
- `docs/README.md`: atualizar mapa de documentos.
- `docs/AGENT_WORKFLOWS.md`: orientar agentes para mudancas full stack.
- `docs/ARCHITECTURE.md`: separar estado atual e arquitetura alvo.
- `docs/DATA_AND_API_CONTRACTS.md`: orientar migracao de mocks para API, DTOs,
  Prisma e banco.
- `docs/ROADMAP.md`: substituir fase antiga por fases full stack.
- `docs/PRODUCTION_CHECKLIST.md`: atualizar criterios para backend, banco,
  Docker, Railway e CI/CD.
- `docs/FULL_STACK_FOUNDATION.md`: novo guia central da nova fase.

## Fora de escopo desta tarefa

Esta tarefa nao implementa NestJS, Prisma, PostgreSQL real, CI/CD, Dockerfiles
novos, migrations, endpoints, auth real ou deploy. Ela atualiza a documentacao
para orientar esse desenvolvimento futuro.

## Criterios de aceite

- A documentacao nao trata mais backend real como proibido por padrao.
- A documentacao deixa claro que a implementacao deve ocorrer por fases.
- O estado atual do repo continua descrito honestamente como frontend validado
  com mocks.
- A arquitetura alvo Next + Nest + PostgreSQL + Prisma + Railway fica explicita.
- Guardrails para agentes impedem big bang, dependencia desnecessaria e quebra
  do frontend validado.
- Validacao de mudancas de documentacao inclui revisao de links e consistencia
  entre os arquivos alterados.
