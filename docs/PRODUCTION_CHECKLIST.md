# Production Checklist

Este checklist descreve o caminho para producao a partir da fase Full Stack
Foundation. O frontend esta validado como baseline; backend, banco, Docker de
producao, Railway e CI/CD ainda precisam ser implementados por fases.

## Status atual

- Frontend Next.js validado: concluido.
- Backend NestJS: nao implementado.
- PostgreSQL real integrado ao app: nao implementado.
- Prisma schema/migrations: nao implementado.
- Auth real: nao implementada.
- Billing real: nao implementado.
- CI/CD GitHub Actions: nao versionado.
- Deploy Railway: alvo primario, ainda nao configurado.
- AWS: alternativa futura.
- Docker local: disponivel para frontend e PostgreSQL local.

## Gate de baseline frontend

- [x] `pnpm run lint` passou.
- [x] `pnpm run lint:types` passou.
- [x] `pnpm test` passou.
- [x] `pnpm run build` passou.
- [x] `pnpm run test:e2e` passou.
- [x] Landing renderiza em mobile, tablet e desktop.
- [x] Login/register mockados funcionam.
- [x] Dashboard nao quebra com dados mockados.
- [x] Projetos permitem criar, filtrar e remover sem quebrar layout.
- [x] Billing alterna planos e ciclo visual corretamente.
- [x] Settings atualiza perfil, config mock e API keys fake.
- [x] Tema claro/escuro funciona e persiste.
- [x] Notificacoes aparecem e podem ser limpas.
- [x] Bottom nav mobile/tablet nao sobrepoe conteudo critico no smoke.
- [x] Header desktop nao sobrepoe em tablets; a nav completa aparece em `xl+`.
- [x] Textos longos nao estouram containers nos fluxos cobertos por testes.

Observacao de 2026-07-08: comandos de qualidade passaram localmente com
`pnpm.cmd`. O smoke Playwright Chromium cobre 320, 375, 768, 1024, 1365 e
1536px.

## Gate de documentacao full stack

- [x] `docs/FULL_STACK_FOUNDATION.md` criado.
- [x] `AGENTS.md` atualizado para a nova fase.
- [x] `README.md` atualizado para estado atual e stack alvo.
- [x] `docs/README.md` atualizado.
- [x] `docs/AGENT_WORKFLOWS.md` atualizado.
- [x] `docs/ARCHITECTURE.md` atualizado.
- [x] `docs/DATA_AND_API_CONTRACTS.md` atualizado.
- [x] `docs/ROADMAP.md` atualizado.
- [x] `docs/PRODUCTION_CHECKLIST.md` atualizado.
- [x] Revisao final de links, caminhos e consistencia concluida.

## Qualidade de codigo

- [x] TypeScript strict mantido no frontend atual.
- [x] Nenhum novo `any` introduzido na fase frontend.
- [x] Componentes reutilizaveis ficam em `components/ui`.
- [x] Logica de dominio compartilhada nao fica escondida em JSX sem
  necessidade no estado atual.
- [x] Nenhuma dependencia nova foi adicionada sem necessidade na validacao
  frontend.
- [x] Arquivos gerados pelo Next, como `next-env.d.ts`, nao foram editados
  manualmente.
- [ ] Quando NestJS existir, TypeScript strict tambem deve valer para a API.
- [ ] Quando Prisma existir, schema e migrations devem ser revisados.
- [ ] Quando CI existir, lint/typecheck/tests/build devem rodar antes de deploy.

## UI, acessibilidade e UX

- [x] Navegacao por teclado funciona nos fluxos principais cobertos por E2E.
- [x] Botoes icon-only possuem `aria-label` ou nome acessivel.
- [x] Inputs possuem label e erros conectados.
- [x] Menu do usuario nao contem toggle redundante de dark mode.
- [x] Contraste visual principal foi conferido em tema claro e escuro.
- [x] Animacoes respeitam movimento reduzido quando usam os presets ou CSS
  global.
- [x] Estados loading, vazio e erro existem nos fluxos que consultam dados.
- [x] Modais fecham por Escape e clique no backdrop quando aplicavel.
- [x] Layout foi verificado em 320px, 375px, 768px, 1024px e desktop largo.
- [x] Smoke Playwright verificou viewports Chromium 320, 375, 768, 1024, 1365
  e 1536px.

## Next.js e build

- [x] Mudancas de App Router devem consultar a doc local
  `node_modules/next/dist/docs/`.
- [x] `next.config.ts` continua com `reactStrictMode`.
- [x] `typescript.ignoreBuildErrors` continua `false`.
- [ ] Avaliar `output: "standalone"` antes de deploy Docker self-hosted.
- [ ] `images.remotePatterns` deve permitir apenas hosts necessarios quando
  imagens remotas forem usadas.
- [ ] Server Components devem ser usados para leitura server-side quando
  simplificarem dados e nao exigirem browser APIs.
- [ ] Client Components devem ficar no menor trecho interativo possivel.
- [ ] Build Docker standalone deve ser testado antes de usar imagem em producao.

## NestJS API futura

- [ ] Estrutura da API definida e documentada.
- [ ] Healthcheck implementado.
- [ ] Modulos por dominio definidos.
- [ ] Controllers finos.
- [ ] Services com regras de negocio.
- [ ] DTOs de request/response.
- [ ] Validacao server-side.
- [ ] Erros padronizados.
- [ ] Guards para rotas sensiveis.
- [ ] Logs estruturados sem dados sensiveis.
- [ ] Testes unitarios de services/controllers.
- [ ] OpenAPI/Swagger quando contratos HTTP estabilizarem.

## Prisma e PostgreSQL futuros

- [ ] `DATABASE_URL` documentado e tratado como segredo.
- [ ] Prisma instalado/configurado.
- [ ] `schema.prisma` inicial definido.
- [ ] Migration inicial versionada.
- [ ] Seeds locais documentadas com dados fake.
- [ ] Constraints e indices revisados.
- [ ] `prisma generate` validado.
- [ ] Migrations rodam localmente.
- [ ] Railway Postgres configurado como servico separado.
- [ ] Migrations de deploy rodam como comando explicito/pre-deploy.
- [ ] Backups e restore definidos antes de producao real.

## Seguranca

- [ ] `.env` nao versionado.
- [ ] Nenhum segredo em `NEXT_PUBLIC_*`.
- [ ] Chaves mockadas nao usadas em producao.
- [ ] Dependencias auditadas antes de release.
- [ ] Headers de seguranca definidos na fase de deploy.
- [ ] CSP avaliada para scripts, imagens e conexoes.
- [ ] Politica de CORS definida quando API existir.
- [ ] Cookies marcados como `HttpOnly`, `Secure` e `SameSite` quando auth real
  existir.
- [ ] Fluxos sensiveis possuem protecao contra CSRF quando aplicavel.
- [ ] Rate limiting definido em endpoints sensiveis.
- [ ] Logs nao incluem senhas, tokens, cookies ou chaves.

## Docker e Railway

- [ ] Dockerfile(s) de producao definidos por servico.
- [ ] Imagens rodam como usuario nao-root quando possivel.
- [ ] Build de imagem validado localmente.
- [ ] Start de container validado localmente.
- [ ] Healthcheck configurado por servico.
- [ ] Railway Postgres usado como banco gerenciado.
- [ ] Variaveis por servico documentadas.
- [ ] Pre-deploy migrations Prisma configuradas quando Prisma existir.
- [ ] Rollback/redeploy documentado.
- [ ] Banco nao roda dentro do mesmo container da aplicacao em producao.

## GitHub Actions e CI/CD

- [ ] Workflow de lint.
- [ ] Workflow de typecheck.
- [ ] Workflow de testes.
- [ ] Workflow de build.
- [ ] Workflow de E2E quando aplicavel.
- [ ] Workflow de build de imagem Docker quando aplicavel.
- [ ] Deploy Railway protegido por secrets e gates.
- [ ] Falha de validacao bloqueia deploy.
- [ ] Environments/secrets documentados.
- [ ] Branch protection ou regra equivalente avaliada.

## AWS futura

AWS nao e alvo inicial. Quando houver necessidade real:

- [ ] Escolher runtime: ECS/Fargate como direcao provavel.
- [ ] Escolher banco: RDS PostgreSQL como direcao provavel.
- [ ] Definir ECR para imagens.
- [ ] Definir VPC, subnets e security groups.
- [ ] Definir IAM/OIDC para GitHub Actions.
- [ ] Definir CloudWatch logs/metricas.
- [ ] Documentar custo e trade-offs antes de migrar.

## Release gate

Uma release de producao so deve ser aceita quando:

- Todos os itens aplicaveis da fase atual estiverem marcados.
- Itens nao aplicaveis estiverem explicitamente justificados.
- O build de producao foi executado.
- Fluxos criticos foram validados em ambiente equivalente a producao.
- Migrations foram aplicadas de forma controlada quando houver banco real.
- Healthchecks passam.
- Rollback ou redeploy manual esta documentado.
- Roadmap e docs refletem o estado real do repositorio.
