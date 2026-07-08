# Production Checklist

Este checklist descreve o caminho para producao. No estado atual, o foco ainda
e validacao frontend. Itens de backend e banco sao preparatorios e nao devem ser
implementados sem pedido explicito.

## Status atual

- Frontend starter kit funcional: em validacao.
- Backend real: nao implementado.
- PostgreSQL real: nao integrado ao app.
- Auth real: nao implementada.
- Billing real: nao implementado.
- CI: nao versionado no repositorio.
- Docker local: disponivel.

## Gate de validacao frontend

- [x] `pnpm run lint` passa.
- [x] `pnpm run lint:types` passa.
- [x] `pnpm test` passa.
- [x] `pnpm run build` passa.
- [x] `pnpm run test:e2e` passa.
- [x] Landing renderiza em mobile, tablet e desktop.
- [x] Login/register mockados funcionam.
- [x] Dashboard nao quebra com dados mockados.
- [x] Projetos permitem criar, filtrar e remover sem quebrar layout.
- [x] Billing alterna planos e ciclo visual corretamente.
- [x] Settings atualiza perfil, config mock e API keys fake.
- [x] Tema claro/escuro funciona e persiste.
- [x] Notificacoes aparecem e podem ser limpas.
- [x] Bottom nav mobile nao sobrepoe conteudo critico no smoke mobile.
- [x] Textos longos nao estouram containers nos fluxos cobertos por testes.

Observacao de 2026-07-08: comandos de qualidade passaram localmente com
`pnpm.cmd`. O smoke Playwright Chromium cobre 320, 375, 768, 1024, 1365 e
1536px, validando landing, tema, login mock, navegacao principal, formulario de
projetos, billing mockado, settings, ausencia de overflow horizontal no
documento e foco visivel em controles principais. No Windows,
`pnpm.cmd run test:e2e` gerencia o dev server por
`scripts/run-playwright-e2e.mjs` e encerra a arvore de processos que ele mesmo
iniciar.

## Qualidade de codigo

- [x] TypeScript strict mantido.
- [x] Nenhum novo `any` introduzido.
- [x] Componentes reutilizaveis ficam em `components/ui`.
- [x] Logica de dominio compartilhada nao fica escondida em JSX sem
  necessidade.
- [x] Nenhuma dependencia nova foi adicionada sem necessidade.
- [x] Arquivos gerados pelo Next, como `next-env.d.ts`, nao foram editados
  manualmente.
- [x] Documentacao em `docs/` foi atualizada quando contratos ou arquitetura
  mudaram.

## UI, acessibilidade e UX

- [x] Navegacao por teclado funciona nos fluxos principais cobertos por E2E.
- [x] Botoes icon-only possuem `aria-label` ou nome acessivel.
- [x] Inputs possuem label e erros conectados.
- [x] Contraste visual principal foi conferido em tema claro e escuro.
- [x] Animacoes respeitam movimento reduzido quando usam os presets ou CSS
  global.
- [x] Estados loading, vazio e erro existem nos fluxos que consultam dados.
- [x] Modais fecham por Escape e clique no backdrop quando aplicavel.
- [x] Layout foi verificado em 320px, 375px, 768px, 1024px e desktop largo.
- [x] Smoke Playwright verificou viewports Chromium 320, 375, 768, 1024, 1365
  e 1536px.

## Next.js e build

- [x] Mudancas de App Router foram conferidas na doc local
  `node_modules/next/dist/docs/`.
- [x] `next.config.ts` continua com `reactStrictMode`.
- [x] `typescript.ignoreBuildErrors` continua `false`.
- [ ] `images.remotePatterns` permite apenas hosts necessarios.
- [x] Client Components sao usados por necessidade real de interatividade na
  fase frontend atual.
- [ ] Server Components, Route Handlers e novas rotas so foram adicionados se a
  fase permitir.
- [ ] Build Docker standalone foi testado antes de usar imagem em producao.

## Backend futuro

Nao implementar sem pedido explicito. Quando a fase iniciar:

- [ ] Contratos de API definidos antes do servidor.
- [ ] DTOs e erros padronizados.
- [ ] Auth real definida: sessao, cookies/tokens, expiracao e refresh.
- [ ] Rate limiting em endpoints sensiveis.
- [ ] Validacao server-side com schema.
- [ ] Logs estruturados sem dados sensiveis.
- [ ] Healthcheck real.
- [ ] Documentacao OpenAPI ou equivalente.
- [ ] Testes de integracao para endpoints criticos.

## Banco de dados futuro

Nao implementar sem pedido explicito. Quando a fase iniciar:

- [ ] Ferramenta de migrations definida.
- [ ] Migrations reproduziveis.
- [ ] Seeds locais documentadas.
- [ ] Constraints e indices revisados.
- [ ] Backups e restore testados.
- [ ] Usuario de aplicacao com menor privilegio.
- [ ] Segredos fora do frontend.
- [ ] Dados sensiveis criptografados ou protegidos conforme necessidade.

## Seguranca

- [ ] `.env` nao versionado.
- [ ] Nenhum segredo em `NEXT_PUBLIC_*`.
- [ ] Chaves mockadas nao usadas em producao.
- [ ] Dependencias auditadas antes de release.
- [ ] Headers de seguranca definidos na fase de deploy.
- [ ] CSP avaliada para scripts, imagens e conexoes.
- [ ] Politica de CORS definida quando backend existir.
- [ ] Cookies marcados como `HttpOnly`, `Secure` e `SameSite` quando auth real
  existir.
- [ ] Fluxos sensiveis possuem protecao contra CSRF quando aplicavel.

## Deploy e operacao

- [ ] Ambiente de deploy escolhido e documentado.
- [ ] Variaveis por ambiente documentadas.
- [ ] CI executa lint, typecheck, tests e build.
- [ ] Preview deploys ou ambiente staging disponivel.
- [ ] Observabilidade definida: erros, logs e metricas.
- [ ] Rollback documentado.
- [ ] Runbook minimo para incidentes.
- [ ] Docker image final roda como usuario nao-root.
- [ ] Healthcheck de aplicacao disponivel.

## Release gate

Uma release de producao so deve ser aceita quando:

- Todos os itens aplicaveis da fase atual estiverem marcados.
- Itens nao aplicaveis estiverem explicitamente justificados.
- O build de producao foi executado.
- Fluxos criticos foram validados em ambiente equivalente a producao.
- Roadmap e docs refletem o estado real do repositorio.
