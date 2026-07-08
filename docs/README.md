# Documentacao do StarterKit Next

Esta pasta existe para acelerar desenvolvimento agentico neste starter kit.
Cada documento deve ajudar um agente a tomar decisoes melhores antes de editar
codigo. Evite adicionar documentos conceituais sem efeito direto no trabalho.

## Ordem recomendada para agentes

1. Leia `AGENTS.md` na raiz.
2. Leia este indice.
3. Leia o documento especifico do tipo de tarefa.
4. Leia os arquivos reais antes de editar.
5. Rode a validacao cabivel antes de finalizar.

Para tarefas de Next.js, App Router, build, deploy, imagens, metadata, routing,
Server Components ou Client Components, consulte tambem a documentacao local
versionada em `node_modules/next/dist/docs/`. Ela corresponde a versao instalada
do Next neste repositorio.

## Mapa dos documentos

- `AGENT_WORKFLOWS.md`: protocolos de trabalho para agentes, guardrails,
  matriz de validacao e como decompor tarefas.
- `ARCHITECTURE.md`: arquitetura atual, fluxo de renderizacao, estado global,
  componentes principais e limites conhecidos.
- `FRONTEND_PATTERNS.md`: padroes de UI, responsividade, tema, formularios,
  animacoes e testes de frontend.
- `DATA_AND_API_CONTRACTS.md`: contratos atuais de estado, API mockada e caminho
  para trocar mocks por backend real.
- `ROADMAP.md`: fases do projeto, com foco atual em validacao frontend e fases
  futuras de backend, banco e producao.
- `PRODUCTION_CHECKLIST.md`: checklist objetivo para sair de demo validada para
  aplicacao pronta para producao.

## Estado atual

O repositorio e um starter kit frontend em Next.js com experiencia SaaS demo:
landing, autenticacao simulada, dashboard, projetos, assinatura, configuracoes,
tema claro/escuro, componentes reutilizaveis, mocks, testes Vitest e smoke
Playwright Chromium.

O foco atual e validar frontend: fluxos, responsividade, visual, contratos de
mock e qualidade de build. Backend real, PostgreSQL real, Railway CD e monorepo
so devem ser implementados apos pedido explicito.

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
Chromium para validar desktop, tablet e mobile sem adicionar backend real.

No Windows, se o `webServer` gerenciado pelo Playwright prender a arvore de
processos, rode `pnpm.cmd run dev` em uma sessao separada e depois
`pnpm.cmd run test:e2e`; a configuracao usa `reuseExistingServer`.

## Referencias externas

Use referencias externas apenas quando o contexto local nao bastar. Para Next.js,
prefira primeiro `node_modules/next/dist/docs/`.

- Next.js AI Coding Agents: https://nextjs.org/docs/app/guides/ai-agents
- Next.js Project Structure: https://nextjs.org/docs/app/getting-started/project-structure
- Next.js Production Checklist: https://nextjs.org/docs/app/guides/production-checklist
- Next.js Deploying: https://nextjs.org/docs/app/getting-started/deploying
- Next.js Vitest: https://nextjs.org/docs/app/guides/testing/vitest
- Next.js Playwright: https://nextjs.org/docs/app/guides/testing/playwright
