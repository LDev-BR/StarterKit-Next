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

- [ ] `pnpm run lint` passa.
- [ ] `pnpm run lint:types` passa.
- [ ] `pnpm test` passa.
- [ ] `pnpm run build` passa.
- [ ] Landing renderiza em mobile e desktop.
- [ ] Login/register mockados funcionam.
- [ ] Dashboard nao quebra com dados mockados.
- [ ] Projetos permitem criar, filtrar e remover sem quebrar layout.
- [ ] Billing alterna planos e ciclo visual corretamente.
- [ ] Settings atualiza perfil, config mock e API keys fake.
- [ ] Tema claro/escuro funciona e persiste.
- [ ] Notificacoes aparecem e podem ser limpas.
- [ ] Bottom nav mobile nao sobrepoe conteudo critico.
- [ ] Textos longos nao estouram containers.

## Qualidade de codigo

- [ ] TypeScript strict mantido.
- [ ] Nenhum novo `any` introduzido.
- [ ] Componentes reutilizaveis ficam em `components/ui`.
- [ ] Logica de dominio nao fica escondida em JSX sem necessidade.
- [ ] Dependencias novas foram justificadas e documentadas.
- [ ] Arquivos gerados pelo Next, como `next-env.d.ts`, nao foram editados
  manualmente.
- [ ] Documentacao em `docs/` foi atualizada quando contratos ou arquitetura
  mudaram.

## UI, acessibilidade e UX

- [ ] Navegacao por teclado funciona em menus, formularios, modais e dialogs.
- [ ] Botoes icon-only possuem `aria-label` ou nome acessivel.
- [ ] Inputs possuem label e erros conectados.
- [ ] Contraste foi conferido em tema claro e escuro.
- [ ] Animacoes respeitam movimento reduzido quando usam os presets.
- [ ] Estados loading, vazio e erro existem nos fluxos que consultam dados.
- [ ] Modais fecham por Escape e clique no backdrop quando aplicavel.
- [ ] Layout foi verificado em pelo menos 375px, 768px, 1024px e desktop largo.

## Next.js e build

- [ ] Mudancas de App Router foram conferidas na doc local
  `node_modules/next/dist/docs/`.
- [ ] `next.config.ts` continua com `reactStrictMode`.
- [ ] `typescript.ignoreBuildErrors` continua `false`.
- [ ] `images.remotePatterns` permite apenas hosts necessarios.
- [ ] Client Components sao usados por necessidade real de interatividade.
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

